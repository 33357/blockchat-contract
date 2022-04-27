//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./interfaces/IBlockChat.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockChat is IBlockChat, Ownable {
    mapping(bytes20 => uint48[]) public recipientMessageBlockListMap;
    mapping(bytes32 => uint256) public dataBlockMap;

    uint256 public blockSkip = 50;

    constructor() {}

    /* ================ VIEW FUNCTIONS ================ */

    function getRecipientHash(string calldata name) external pure override returns (bytes20) {
        return bytes20(uint160(uint256(keccak256(abi.encodePacked(name)))));
    }

    function getNameHash(string calldata name) public pure override returns (bytes12) {
        return bytes12(keccak256(abi.encodePacked(name)));
    }

    function getRecipientMessageBlockListLength(bytes20 recipientHash) external view override returns (uint256) {
        return recipientMessageBlockListMap[recipientHash].length;
    }

    function batchRecipientMessageBlock(
        bytes20 recipientHash,
        uint256 start,
        uint256 length
    ) external view override returns (uint48[] memory) {
        uint48[] memory messageHashList = new uint48[](length);
        for (uint256 i = 0; i < length; i++) {
            messageHashList[i] = recipientMessageBlockListMap[recipientHash][start + i];
        }
        return messageHashList;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes20 recipientHash, string calldata content) public override {
        uint48[] memory messageBlockList = recipientMessageBlockListMap[recipientHash];
        if (messageBlockList.length == 0 || block.number - messageBlockList[messageBlockList.length - 1] > blockSkip) {
            recipientMessageBlockListMap[recipientHash].push(uint48(block.number));
        }
        emit MessageCreated(msg.sender, recipientHash, uint48(block.timestamp), content);
    }

    function createMessageWithData(
        bytes20 recipientHash,
        string calldata content,
        bytes calldata data
    ) external override {
        (bool success, ) = address(recipientHash).call(data);
        require(success, "BlockChatUpgradeable2: call error");
        createMessage(recipientHash, content);
    }

    function uploadData(bytes12 nameHash, string calldata content) external override {
        bytes32 dataHash = bytes32(abi.encodePacked(msg.sender, nameHash));
        dataBlockMap[dataHash] = block.number;
        emit DataUploaded(dataHash, content);
    }

    /* ================ ADMIN FUNCTIONS ================ */

    function setBlockSkip(uint256 newBlockSkip) external onlyOwner {
        blockSkip = newBlockSkip;
    }
}
