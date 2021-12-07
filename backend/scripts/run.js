//SPDX-License-Identifier: MIT
const hre = require("hardhat");

const main = async () => {
    const kopiContractFactory = await hre.ethers.getContractFactory("BuyMeACoffee");
    const kopiContract = await kopiContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1")
    });

    await kopiContract.deployed();
    console.log("Coffee Contract deployed to:", kopiContract.address);

    let contractBalance = await hre.ethers.provider.getBalance(
        kopiContract.address
    );
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    const coffeeTxn = await kopiContract.buyCoffee(
        "Kupi nomor wahid #1",
        "fadil",
        ethers.utils.parseEther("0.001")
    );
    await coffeeTxn.wait();

    contractBalance = await hre.ethers.provider.getBalance(
        kopiContract.address
    );
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    let getSemuaKopi = await kopiContract.getAllCoffee();
    console.log(getSemuaKopi);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();