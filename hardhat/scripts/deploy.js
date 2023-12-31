// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  // url of the metadata folder on ipfs
  const metadataURL = "ipfs://QmaLk1AcD6oBLFEiUYpcHfCkh4wr4CFUZvUYX4jvpE1YBq";

  const robotNftContract = await hre.ethers.deployContract("RobotNFTs", [
    metadataURL
  ]);

  await robotNftContract.waitForDeployment();
  console.log("RobotNfts contract address:", robotNftContract.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
