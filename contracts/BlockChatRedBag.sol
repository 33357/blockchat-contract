//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./interfaces/IBlockChatUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BlockChatRedBag is ERC20 {
    IBlockChatUpgradeable public blockChat = IBlockChatUpgradeable(0x21f4463D28c2921c34063D676d9Cefb159820aed);

    string public content;

    uint256 public tokenTotalAmount = 10**18 * 10**8;

    mapping(address => bool) public getMap;

    uint256 getAmount;

    constructor(string memory newContent) ERC20("BlockChatRedBag", "BCRB") {
        content = newContent;
        _mint(msg.sender, tokenTotalAmount / 5);
    }

    /* ================ UTIL FUNCTIONS ================ */

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        blockChat.createMessage(
            bytes20(address(this)),
            string(
                abi.encodePacked(
                    "tr::",
                    Strings.toHexString(uint160(from), 20),
                    "::",
                    Strings.toHexString(uint160(to), 20),
                    "::",
                    Strings.toString(amount)
                )
            ),
            false
        );
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function getRedBag() public {
        require(!getMap[tx.origin], "BlockChatRedBag: You have already got the red bag");
        bytes32 messageHash = blockChat.getMessageHash(
            tx.origin,
            bytes20(address(this)),
            uint48(block.timestamp),
            content
        );
        require(blockChat.messageHashMap(messageHash), "BlockChatRedBag: Message not exists");
        _mint(tx.origin, airdropAmount());
        getMap[tx.origin] = true;
        getAmount++;
    }

    function airdropAmount() public view returns (uint256) {
        if (getAmount < 100) {
            return tokenTotalAmount / 5 / 100;
        }
        if (getAmount < 1000) {
            return tokenTotalAmount / 5 / 1000;
        }
        if (getAmount < 10000) {
            return tokenTotalAmount / 5 / 10000;
        }
        if (getAmount < 100000) {
            return tokenTotalAmount / 5 / 100000;
        }
        return 0;
    }
}
