// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title CampusBoost
 * @dev Milestone-based Escrow Crowdfunding & Sponsorship platform for student projects.
 */
contract CampusBoost is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    enum ProjectStatus {
        Draft,
        PendingReview,
        Active,
        Completed,
        Cancelled,
        Disputed
    }

    enum MilestoneStatus {
        Pending,
        Submitted,
        Approved,
        Rejected,
        Released
    }

    struct MilestoneInput {
        string title;
        string description;
        uint256 amount;
        uint256 deadline;
    }

    struct Milestone {
        string title;
        string description;
        uint256 amount;
        uint256 deadline;
        MilestoneStatus status;
        string evidenceURI;
    }

    struct Project {
        uint256 projectId;
        address owner;
        string title;
        string description;
        string category;
        uint256 goalAmount;
        uint256 raisedAmount;
        uint256 deadline;
        ProjectStatus status;
        Milestone[] milestones;
    }

    struct BackerContribution {
        uint256 nativeAmount;
        uint256 tokenAmount;
        uint256 packageId;
        uint256 timestamp;
    }

    // State Variables
    uint256 public projectCounter;
    uint256 public platformFeePercent = 2; // 2%
    address public feeRecipient;
    IERC20 public fundingToken; // Optional ERC20 token (e.g. USDC)

    // Mappings
    mapping(uint256 => Project) private _projects;
    mapping(uint256 => address[]) private _projectBackers;
    mapping(uint256 => mapping(address => BackerContribution)) public projectContributions;
    mapping(uint256 => mapping(address => bool)) public isSponsor;
    mapping(uint256 => uint256) public projectTotalReleased;

    // Events as specified in README
    event ProjectCreated(uint256 indexed projectId, address indexed owner, uint256 goalAmount);
    event ProjectApproved(uint256 indexed projectId);
    event ProjectSupported(uint256 indexed projectId, address indexed supporter, uint256 amount, uint256 packageId);
    event MilestoneSubmitted(uint256 indexed projectId, uint256 indexed milestoneIndex, string evidenceURI);
    event MilestoneApproved(uint256 indexed projectId, uint256 indexed milestoneIndex);
    event MilestoneReleased(uint256 indexed projectId, uint256 indexed milestoneIndex, uint256 amount);
    event DisputeOpened(uint256 indexed projectId, uint256 indexed milestoneIndex, string reason);
    event DisputeResolved(uint256 indexed projectId, uint256 indexed milestoneIndex, bool releaseFunds);
    event BackerRefunded(uint256 indexed projectId, address indexed backer, uint256 nativeAmount, uint256 tokenAmount);

    modifier onlyAdmin() {
        require(msg.sender == owner(), "CampusBoost: Caller is not admin");
        _;
    }

    modifier onlyProjectOwner(uint256 projectId) {
        require(_projects[projectId].owner == msg.sender, "CampusBoost: Caller is not project owner");
        _;
    }

    modifier onlySponsorOrAdmin(uint256 projectId) {
        require(
            msg.sender == owner() || isSponsor[projectId][msg.sender],
            "CampusBoost: Caller must be sponsor or admin"
        );
        _;
    }

    constructor(address _feeRecipient, address _tokenAddress) Ownable(msg.sender) {
        feeRecipient = _feeRecipient != address(0) ? _feeRecipient : msg.sender;
        if (_tokenAddress != address(0)) {
            fundingToken = IERC20(_tokenAddress);
        }
    }

    function setFundingToken(address _tokenAddress) external onlyAdmin {
        fundingToken = IERC20(_tokenAddress);
    }

    function setFeeRecipient(address _newRecipient) external onlyAdmin {
        require(_newRecipient != address(0), "Invalid recipient");
        feeRecipient = _newRecipient;
    }

    function setPlatformFeePercent(uint256 _percent) external onlyAdmin {
        require(_percent <= 10, "Fee cannot exceed 10%");
        platformFeePercent = _percent;
    }

    /**
     * @notice Create a new project with milestones
     */
    function createProject(
        string memory title,
        string memory description,
        string memory category,
        uint256 goalAmount,
        uint256 deadline,
        MilestoneInput[] memory milestones
    ) external whenNotPaused returns (uint256 projectId) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(goalAmount > 0, "Goal must be greater than zero");
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(milestones.length > 0, "Must have at least one milestone");

        uint256 totalMilestoneAmount = 0;
        for (uint256 i = 0; i < milestones.length; i++) {
            require(milestones[i].amount > 0, "Milestone amount must be > 0");
            totalMilestoneAmount += milestones[i].amount;
        }
        require(totalMilestoneAmount == goalAmount, "Sum of milestones must equal goalAmount");

        projectCounter++;
        projectId = projectCounter;

        Project storage newProject = _projects[projectId];
        newProject.projectId = projectId;
        newProject.owner = msg.sender;
        newProject.title = title;
        newProject.description = description;
        newProject.category = category;
        newProject.goalAmount = goalAmount;
        newProject.raisedAmount = 0;
        newProject.deadline = deadline;
        newProject.status = ProjectStatus.PendingReview;

        for (uint256 i = 0; i < milestones.length; i++) {
            newProject.milestones.push(
                Milestone({
                    title: milestones[i].title,
                    description: milestones[i].description,
                    amount: milestones[i].amount,
                    deadline: milestones[i].deadline,
                    status: MilestoneStatus.Pending,
                    evidenceURI: ""
                })
            );
        }

        emit ProjectCreated(projectId, msg.sender, goalAmount);
    }

    /**
     * @notice Admin approves project to open for funding
     */
    function approveProject(uint256 projectId) external onlyAdmin {
        Project storage project = _projects[projectId];
        require(project.status == ProjectStatus.PendingReview, "Project not pending review");
        project.status = ProjectStatus.Active;

        emit ProjectApproved(projectId);
    }

    /**
     * @notice Support project using native currency (ETH / POL)
     * @param projectId The ID of the project to support
     * @param packageId Tier id: 1=Supporter, 2=Booster, 3=Sponsor, 4=Title Sponsor
     */
    function supportProject(uint256 projectId, uint256 packageId) external payable nonReentrant whenNotPaused {
        Project storage project = _projects[projectId];
        require(project.status == ProjectStatus.Active, "Project is not active");
        require(block.timestamp <= project.deadline, "Project funding deadline passed");
        require(msg.value > 0, "Contribution must be > 0");

        project.raisedAmount += msg.value;

        _recordContribution(projectId, msg.sender, msg.value, 0, packageId);
        emit ProjectSupported(projectId, msg.sender, msg.value, packageId);
    }

    /**
     * @notice Support project using ERC20 Token (e.g. USDC)
     */
    function supportProjectWithToken(
        uint256 projectId,
        uint256 packageId,
        uint256 amount
    ) external nonReentrant whenNotPaused {
        require(address(fundingToken) != address(0), "ERC20 token not configured");
        Project storage project = _projects[projectId];
        require(project.status == ProjectStatus.Active, "Project is not active");
        require(block.timestamp <= project.deadline, "Project funding deadline passed");
        require(amount > 0, "Contribution must be > 0");

        fundingToken.safeTransferFrom(msg.sender, address(this), amount);
        project.raisedAmount += amount;

        _recordContribution(projectId, msg.sender, 0, amount, packageId);
        emit ProjectSupported(projectId, msg.sender, amount, packageId);
    }

    function _recordContribution(
        uint256 projectId,
        address backer,
        uint256 nativeAmount,
        uint256 tokenAmount,
        uint256 packageId
    ) internal {
        BackerContribution storage c = projectContributions[projectId][backer];
        if (c.nativeAmount == 0 && c.tokenAmount == 0) {
            _projectBackers[projectId].push(backer);
        }
        c.nativeAmount += nativeAmount;
        c.tokenAmount += tokenAmount;
        c.packageId = packageId;
        c.timestamp = block.timestamp;

        // If packageId >= 3 (Sponsor or Title Sponsor), grant sponsor verification role
        if (packageId >= 3) {
            isSponsor[projectId][backer] = true;
        }
    }

    /**
     * @notice Project Owner submits milestone deliverables & proof
     */
    function submitMilestoneEvidence(
        uint256 projectId,
        uint256 milestoneIndex,
        string memory evidenceURI
    ) external onlyProjectOwner(projectId) {
        Project storage project = _projects[projectId];
        require(project.status == ProjectStatus.Active, "Project is not active");
        require(milestoneIndex < project.milestones.length, "Invalid milestone index");

        Milestone storage milestone = project.milestones[milestoneIndex];
        require(
            milestone.status == MilestoneStatus.Pending || milestone.status == MilestoneStatus.Rejected,
            "Milestone not in submittable state"
        );
        require(bytes(evidenceURI).length > 0, "Evidence URI cannot be empty");

        milestone.status = MilestoneStatus.Submitted;
        milestone.evidenceURI = evidenceURI;

        emit MilestoneSubmitted(projectId, milestoneIndex, evidenceURI);
    }

    /**
     * @notice Sponsor or Admin approves the submitted milestone
     */
    function approveMilestone(
        uint256 projectId,
        uint256 milestoneIndex
    ) external onlySponsorOrAdmin(projectId) {
        Project storage project = _projects[projectId];
        require(project.status == ProjectStatus.Active, "Project is not active");
        require(milestoneIndex < project.milestones.length, "Invalid milestone index");

        Milestone storage milestone = project.milestones[milestoneIndex];
        require(milestone.status == MilestoneStatus.Submitted, "Milestone has not been submitted");

        milestone.status = MilestoneStatus.Approved;

        emit MilestoneApproved(projectId, milestoneIndex);
    }

    /**
     * @notice Release milestone funds to Project Owner after approval
     */
    function releaseMilestoneFunds(
        uint256 projectId,
        uint256 milestoneIndex
    ) external nonReentrant {
        Project storage project = _projects[projectId];
        require(
            msg.sender == owner() || msg.sender == project.owner || isSponsor[projectId][msg.sender],
            "Unauthorized to trigger release"
        );
        require(project.status == ProjectStatus.Active, "Project not active");
        require(milestoneIndex < project.milestones.length, "Invalid milestone index");

        Milestone storage milestone = project.milestones[milestoneIndex];
        require(milestone.status == MilestoneStatus.Approved, "Milestone must be approved before release");

        uint256 payoutAmount = milestone.amount;
        require(project.raisedAmount >= projectTotalReleased[projectId] + payoutAmount, "Insufficient escrowed funds");

        milestone.status = MilestoneStatus.Released;
        projectTotalReleased[projectId] += payoutAmount;

        uint256 fee = (payoutAmount * platformFeePercent) / 100;
        uint256 netToOwner = payoutAmount - fee;

        // Distribute Native or Token depending on contract balance
        if (address(this).balance >= payoutAmount) {
            if (fee > 0) {
                (bool feeSent, ) = payable(feeRecipient).call{value: fee}("");
                require(feeSent, "Fee transfer failed");
            }
            (bool ownerSent, ) = payable(project.owner).call{value: netToOwner}("");
            require(ownerSent, "Owner payout failed");
        } else if (address(fundingToken) != address(0)) {
            if (fee > 0) {
                fundingToken.safeTransfer(feeRecipient, fee);
            }
            fundingToken.safeTransfer(project.owner, netToOwner);
        } else {
            revert("Insufficient contract balance for release");
        }

        // Check if all milestones are released
        bool allCompleted = true;
        for (uint256 i = 0; i < project.milestones.length; i++) {
            if (project.milestones[i].status != MilestoneStatus.Released) {
                allCompleted = false;
                break;
            }
        }
        if (allCompleted) {
            project.status = ProjectStatus.Completed;
        }

        emit MilestoneReleased(projectId, milestoneIndex, payoutAmount);
    }

    /**
     * @notice Open dispute if evidence is unsatisfactory or owner fails to deliver
     */
    function openDispute(
        uint256 projectId,
        uint256 milestoneIndex,
        string memory reason
    ) external {
        Project storage project = _projects[projectId];
        require(project.status == ProjectStatus.Active, "Project not active");
        require(
            msg.sender == owner() ||
            msg.sender == project.owner ||
            projectContributions[projectId][msg.sender].nativeAmount > 0 ||
            projectContributions[projectId][msg.sender].tokenAmount > 0,
            "Only backer, owner, or admin can open dispute"
        );
        require(bytes(reason).length > 0, "Reason required");

        project.status = ProjectStatus.Disputed;

        emit DisputeOpened(projectId, milestoneIndex, reason);
    }

    /**
     * @notice Admin resolves dispute
     * @param releaseFunds If true: milestone is approved & funds released. If false: project cancelled for refund.
     */
    function resolveDispute(
        uint256 projectId,
        uint256 milestoneIndex,
        bool releaseFunds
    ) external onlyAdmin nonReentrant {
        Project storage project = _projects[projectId];
        require(project.status == ProjectStatus.Disputed, "Project not disputed");

        if (releaseFunds) {
            project.status = ProjectStatus.Active;
            project.milestones[milestoneIndex].status = MilestoneStatus.Approved;
            emit DisputeResolved(projectId, milestoneIndex, true);
        } else {
            project.status = ProjectStatus.Cancelled;
            emit DisputeResolved(projectId, milestoneIndex, false);
        }
    }

    /**
     * @notice Backers can claim proportional refund if project is cancelled
     */
    function refundBackers(uint256 projectId) external nonReentrant {
        Project storage project = _projects[projectId];
        require(project.status == ProjectStatus.Cancelled, "Project not cancelled");

        BackerContribution storage c = projectContributions[projectId][msg.sender];
        uint256 nativeRefund = c.nativeAmount;
        uint256 tokenRefund = c.tokenAmount;
        require(nativeRefund > 0 || tokenRefund > 0, "No contribution to refund");

        c.nativeAmount = 0;
        c.tokenAmount = 0;

        if (nativeRefund > 0) {
            (bool sent, ) = payable(msg.sender).call{value: nativeRefund}("");
            require(sent, "Native refund failed");
        }
        if (tokenRefund > 0 && address(fundingToken) != address(0)) {
            fundingToken.safeTransfer(msg.sender, tokenRefund);
        }

        emit BackerRefunded(projectId, msg.sender, nativeRefund, tokenRefund);
    }

    // -------------------------------------------------------------
    // View Functions for Easy Frontend Integration
    // -------------------------------------------------------------

    function getProject(uint256 projectId) external view returns (
        uint256 id,
        address ownerAddr,
        string memory title,
        string memory description,
        string memory category,
        uint256 goalAmount,
        uint256 raisedAmount,
        uint256 deadline,
        ProjectStatus status,
        uint256 milestoneCount
    ) {
        Project storage p = _projects[projectId];
        return (
            p.projectId,
            p.owner,
            p.title,
            p.description,
            p.category,
            p.goalAmount,
            p.raisedAmount,
            p.deadline,
            p.status,
            p.milestones.length
        );
    }

    function getProjectMilestones(uint256 projectId) external view returns (Milestone[] memory) {
        return _projects[projectId].milestones;
    }

    function getProjectBackers(uint256 projectId) external view returns (address[] memory) {
        return _projectBackers[projectId];
    }

    function pause() external onlyAdmin {
        _pause();
    }

    function unpause() external onlyAdmin {
        _unpause();
    }

    receive() external payable {}
}
