//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./interfaces/IBlockChatUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BlockChatERC20 is ERC20 {

    IBlockChatUpgradeable public blockChat = IBlockChatUpgradeable(0x21f4463D28c2921c34063D676d9Cefb159820aed);

    constructor() ERC20("BlockChatERC20", "BC") {}

    /* ================ UTIL FUNCTIONS ================ */

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        blockChat.createMessage(
            bytes20(address(this)),
            string(abi.encodePacked("transfer ", symbol(), " from ", from, " to ", to, " amount ", amount))
        );
    }
}
