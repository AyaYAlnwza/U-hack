const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("=============================================================");
  console.log("🚀 Deploying CampusBoost Smart Contracts");
  console.log("Account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("=============================================================");

  const feeRecipient = process.env.PLATFORM_FEE_RECIPIENT || deployer.address;
  console.log("Platform Fee (2%) Recipient:", feeRecipient);

  // 1. Deploy MockUSDC
  console.log("\n1. Deploying MockUSDC token...");
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("✅ MockUSDC deployed to:", mockUSDCAddress);

  // 2. Deploy CampusBoost Escrow
  console.log("\n2. Deploying CampusBoost Escrow Contract...");
  const CampusBoost = await hre.ethers.getContractFactory("CampusBoost");
  const campusBoost = await CampusBoost.deploy(feeRecipient, mockUSDCAddress);
  await campusBoost.waitForDeployment();
  const campusBoostAddress = await campusBoost.getAddress();
  console.log("✅ CampusBoost deployed to:", campusBoostAddress);

  // 3. Mint test tokens for deployer
  await mockUSDC.mint(deployer.address, hre.ethers.parseUnits("50000", 6));
  console.log("✅ Minted 50,000 MockUSDC to deployer");

  console.log("\n=============================================================");
  console.log("🎉 DEPLOYMENT COMPLETE! นำค่าไปใส่ใน frontend/.env.local:");
  console.log("-------------------------------------------------------------");
  console.log(`NEXT_PUBLIC_CAMPUSBOOST_CONTRACT_ADDRESS=${campusBoostAddress}`);
  console.log(`NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=${mockUSDCAddress}`);
  console.log("=============================================================\n");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
