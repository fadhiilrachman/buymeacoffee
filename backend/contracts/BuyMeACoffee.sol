//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract BuyMeACoffee {
    uint256 totalKopi;

    address payable public yangPunya;

    event KopiBaru (
        address indexed from,
        uint256 timestamp,
        string message,
        string name
    );

    constructor() payable {
        console.log("Hey-yo, wazzap! -Coffee gang");

        yangPunya = payable(msg.sender);
    }

    struct Kopi {
        address giver;
        string message;
        string name;
        uint256 timestamp;
    }

    Kopi[] kopi;

    function getAllCoffee() public view returns (Kopi[] memory) {
        return kopi;
    }

    function getTotalCoffee() public view returns (uint256) {
        console.log("Total ada %d kopi yang udah disumbangin~", totalKopi);
        return totalKopi;
    }

    function buyCoffee(
        string memory _message,
        string memory _name,
        uint256 _payAmount
    ) public payable {
        uint256 cost = 0.001 ether;
        require(_payAmount <= cost, "Yah! Diisi ethnya dulu dong :)");

        totalKopi += 1;
        console.log("%s baru aja ngirim kopi!", msg.sender);

        kopi.push(Kopi(msg.sender, _message, _name, block.timestamp));

        (bool success, ) = yangPunya.call{value: _payAmount}("");
        require(success, "Yah! Masa gagal kirim kopi :(");

        emit KopiBaru(msg.sender, block.timestamp, _message, _name);
    }
}
