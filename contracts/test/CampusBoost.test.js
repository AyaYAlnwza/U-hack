const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CampusBoost Smart Contract", function () {
  let campusBoost, mockUSDC;
  let owner, student, backer, sponsor, feeCollector;

  const goalAmount = ethers.parseEther("1.0"); // 1 ETH total goal
  const milestone1Amount = ethers.parseEther("0.4");
  const milestone2Amount = ethers.parseEther("0.6");

  beforeEach(async function () {
    [owner, student, backer, sponsor, feeCollector] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();

    // Deploy CampusBoost
    const CampusBoost = await ethers.getContractFactory("CampusBoost");
    campusBoost = await CampusBoost.deploy(
      feeCollector.address,
      await mockUSDC.getAddress()
    );
    await campusBoost.waitForDeployment();

    // Transfer some mockUSDC to sponsor
    const usdcDecimals = 6;
    await mockUSDC.transfer(sponsor.address, 10000n * 10n ** BigInt(usdcDecimals));
  });

  describe("1. Project Creation & Admin Approval", function () {
    it("Should allow student to create a project with milestones", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400 * 30; // 30 days
      const milestones = [
        {
          title: "UI/UX & Architecture",
          description: "Complete Figma designs and smart contract prototype",
          amount: milestone1Amount,
          deadline: deadline - 86400 * 15,
        },
        {
          title: "MVP Deployment",
          description: "Working MVP deployed on testnet",
          amount: milestone2Amount,
          deadline: deadline,
        },
      ];

      await expect(
        campusBoost
          .connect(student)
          .createProject(
            "CampusRent - Student Housing Finder",
            "Decentralized rental review & deposit system",
            "Community",
            goalAmount,
            deadline,
            milestones
          )
      )
        .to.emit(campusBoost, "ProjectCreated")
        .withArgs(1, student.address, goalAmount);

      const project = await campusBoost.getProject(1);
      expect(project.title).to.equal("CampusRent - Student Housing Finder");
      expect(project.status).to.equal(1); // PendingReview
      expect(project.milestoneCount).to.equal(2);
    });

    it("Should allow admin to approve a pending project", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400 * 30;
      await campusBoost.connect(student).createProject(
        "AI Waste Sorter",
        "AI-powered campus recycling bin",
        "Environment",
        goalAmount,
        deadline,
        [
          { title: "Hardware spec", description: "Design casing", amount: milestone1Amount, deadline: deadline - 1000 },
          { title: "AI Model", description: "Train vision model", amount: milestone2Amount, deadline: deadline },
        ]
      );

      await expect(campusBoost.connect(owner).approveProject(1))
        .to.emit(campusBoost, "ProjectApproved")
        .withArgs(1);

      const project = await campusBoost.getProject(1);
      expect(project.status).to.equal(2); // Active
    });
  });

  describe("2. Funding & Milestone Release Flow", function () {
    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400 * 30;
      await campusBoost.connect(student).createProject(
        "CampusRent",
        "Description",
        "Community",
        goalAmount,
        deadline,
        [
          { title: "Phase 1 Design", description: "Figma link", amount: milestone1Amount, deadline: deadline - 5000 },
          { title: "Phase 2 Dev", description: "GitHub MVP", amount: milestone2Amount, deadline: deadline },
        ]
      );
      await campusBoost.connect(owner).approveProject(1);
    });

    it("Should allow backer and sponsor to fund project (Escrow)", async function () {
      // Backer contributes 0.4 ETH (tier 1: Supporter)
      await expect(
        campusBoost.connect(backer).supportProject(1, 1, { value: milestone1Amount })
      )
        .to.emit(campusBoost, "ProjectSupported")
        .withArgs(1, backer.address, milestone1Amount, 1);

      // Sponsor contributes 0.6 ETH (tier 3: Sponsor)
      await expect(
        campusBoost.connect(sponsor).supportProject(1, 3, { value: milestone2Amount })
      )
        .to.emit(campusBoost, "ProjectSupported")
        .withArgs(1, sponsor.address, milestone2Amount, 3);

      const project = await campusBoost.getProject(1);
      expect(project.raisedAmount).to.equal(goalAmount);
      expect(await campusBoost.isSponsor(1, sponsor.address)).to.be.true;
    });

    it("Should execute complete Milestone Submit -> Approve -> Release cycle with 2% fee", async function () {
      // Fund fully
      await campusBoost.connect(sponsor).supportProject(1, 3, { value: goalAmount });

      // Student submits milestone 1 evidence
      const evidenceURI = "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
      await expect(
        campusBoost.connect(student).submitMilestoneEvidence(1, 0, evidenceURI)
      )
        .to.emit(campusBoost, "MilestoneSubmitted")
        .withArgs(1, 0, evidenceURI);

      // Sponsor approves milestone 1
      await expect(campusBoost.connect(sponsor).approveMilestone(1, 0))
        .to.emit(campusBoost, "MilestoneApproved")
        .withArgs(1, 0);

      // Release funds for milestone 1
      const studentBalBefore = await ethers.provider.getBalance(student.address);
      const feeBalBefore = await ethers.provider.getBalance(feeCollector.address);

      await expect(campusBoost.connect(owner).releaseMilestoneFunds(1, 0))
        .to.emit(campusBoost, "MilestoneReleased")
        .withArgs(1, 0, milestone1Amount);

      const studentBalAfter = await ethers.provider.getBalance(student.address);
      const feeBalAfter = await ethers.provider.getBalance(feeCollector.address);

      const expectedFee = (milestone1Amount * 2n) / 100n;
      const expectedNetPayout = milestone1Amount - expectedFee;

      expect(feeBalAfter - feeBalBefore).to.equal(expectedFee);
      expect(studentBalAfter - studentBalBefore).to.equal(expectedNetPayout);
    });
  });

  describe("3. Dispute & Refund Flow", function () {
    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400 * 30;
      await campusBoost.connect(student).createProject(
        "CampusRent",
        "Description",
        "Community",
        goalAmount,
        deadline,
        [
          { title: "Phase 1", description: "Design", amount: goalAmount, deadline: deadline },
        ]
      );
      await campusBoost.connect(owner).approveProject(1);
      await campusBoost.connect(backer).supportProject(1, 2, { value: goalAmount });
    });

    it("Should allow backer to open dispute and admin to resolve by cancelling for refund", async function () {
      await expect(campusBoost.connect(backer).openDispute(1, 0, "No progress made after 3 weeks"))
        .to.emit(campusBoost, "DisputeOpened")
        .withArgs(1, 0, "No progress made after 3 weeks");

      let project = await campusBoost.getProject(1);
      expect(project.status).to.equal(5); // Disputed

      // Admin resolves dispute: cancel & allow refund
      await expect(campusBoost.connect(owner).resolveDispute(1, 0, false))
        .to.emit(campusBoost, "DisputeResolved")
        .withArgs(1, 0, false);

      project = await campusBoost.getProject(1);
      expect(project.status).to.equal(4); // Cancelled

      // Backer claims refund
      const balBefore = await ethers.provider.getBalance(backer.address);
      const tx = await campusBoost.connect(backer).refundBackers(1);
      const receipt = await tx.wait();
      const gasSpent = receipt.gasUsed * receipt.gasPrice;
      const balAfter = await ethers.provider.getBalance(backer.address);

      expect(balAfter - balBefore + gasSpent).to.equal(goalAmount);
    });
  });
});
