//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./interfaces/IBlockChatUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BlockChatERC20 is ERC20 {
    IBlockChatUpgradeable public blockChat = IBlockChatUpgradeable(0x21f4463D28c2921c34063D676d9Cefb159820aed);

    constructor() ERC20("BlockChatToken", "BCT") {
        _mint(msg.sender, 10**8 * 10**18);
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
            )
        );
    }
}
