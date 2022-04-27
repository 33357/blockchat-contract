// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IBlockChatUpgradeable5 {
    /* ================ EVENTS ================ */

    event MessageCreated(address indexed sender, bytes20 indexed recipientHash, uint48 createDate, string content);

    event DataUploaded(bytes32 indexed dataHash, string content);

    /* ================ STRUCTS ================ */

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() external pure returns (string memory);

    function getRecipientHash(string memory name) external pure returns (bytes20);

    function getNameHash(string calldata name) external pure returns (bytes12);

    function getRecipientMessageBlockListLength(bytes20 recipientHash) external view returns (uint96);

    function batchRecipientMessageBlock(
        bytes20 recipientHash,
        uint96 start,
        uint96 length
    ) external view returns (uint256[] memory);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes20 recipientHash, string calldata content) external;

    function createMessageWithData(
        bytes20 recipientHash,
        string calldata content,
        bytes calldata data
    ) external;

    function uploadData(bytes12 nameHash, string calldata content) external;
}
