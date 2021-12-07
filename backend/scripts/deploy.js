//SPDX-License-Identifier: MIT
const hre = require("hardhat");

const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());

    const Token = await hre.ethers.getContractFactory("BuyMeACoffee");
    const kopi = await Token.deploy({
        value: hre.ethers.utils.parseEther("0.1")
    });
    await kopi.deployed();

    console.log("BuyMeACoffee address: ", kopi.address);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runMain();