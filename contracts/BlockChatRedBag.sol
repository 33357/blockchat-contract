//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./interfaces/IBlockChatUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BlockChatRedBag is ERC20 {
    IBlockChatUpgradeable public blockChat = IBlockChatUpgradeable(0x21f4463D28c2921c34063D676d9Cefb159820aed);

    uint256 public tokenTotalAmount = 10**18 * 10**8;

    mapping(address => bool) public getMap;

    uint256 getAmount;

    address pair;

    constructor() ERC20("BlockChatRedBag", "BCRB") {
        _mint(msg.sender, tokenTotalAmount / 5);
    }

    /* ================ UTIL FUNCTIONS ================ */

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (from == address(0)) {
            blockChat.createMessage(
                bytes20(address(this)),
                string(
                    abi.encodePacked("mint::", Strings.toHexString(uint160(to), 20), "::", Strings.toString(amount))
                ),
                false
            );
        } else if (to == address(0)) {
            blockChat.createMessage(
                bytes20(address(this)),
                string(
                    abi.encodePacked("burn::", Strings.toHexString(uint160(from), 20), "::", Strings.toString(amount))
                ),
                false
            );
        } else if (from == pair) {
            blockChat.createMessage(
                bytes20(address(this)),
                string(
                    abi.encodePacked(
                        "buy/remove::",
                        Strings.toHexString(uint160(to), 20),
                        "::",
                        Strings.toString(amount)
                    )
                ),
                false
            );
        } else if (to == pair) {
            blockChat.createMessage(
                bytes20(address(this)),
                string(
                    abi.encodePacked(
                        "sell/add::",
                        Strings.toHexString(uint160(from), 20),
                        "::",
                        Strings.toString(amount)
                    )
                ),
                false
            );
        }
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    
    function initPair(address _pair) public {
        require(pair == address(0), "BlockChatRedBag: Pair already set");
        pair = _pair;
    }

    function getRedBag() public {
        require(!getMap[msg.sender], "BlockChatRedBag: You have already got the red bag");
        _mint(msg.sender, airdropAmount());
        getMap[msg.sender] = true;
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
