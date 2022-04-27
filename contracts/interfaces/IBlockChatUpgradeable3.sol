// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IBlockChatUpgradeable3 {
    /* ================ EVENTS ================ */

    event MessageCreated(
        address indexed sender,
        uint48 createDate,
        bytes20 indexed recipientHash,
        string content
    );

    event MessageCreatedToList(
        address indexed sender,
        uint48 createDate,
        bytes20[] recipientHashList,
        string content
    );

    event DataUploaded(address indexed sender, bytes32 indexed dataHash, string content);

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() external pure returns (string memory);

    function getRecipientHash(string calldata name) external pure returns (bytes20);

    function getDataHash(string calldata name) external pure returns (bytes32);

    function getMessageHash(
        address sender,
        uint48 createDate,
        bytes20 recipientHash,
        string calldata content
    ) external pure returns (bytes32);

    function getMessageToListHash(
        address sender,
        uint48 createDate,
        bytes20[] calldata recipientHashList,
        string calldata content
    ) external pure returns (bytes32);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes20 recipientHash, string calldata content) external;

    function createMessageToList(bytes20[] calldata recipientHashList, string calldata content) external;

    function createMessageWithData(
        bytes20 recipientHash,
        string calldata content,
        bytes calldata data
    ) external;

    function uploadData(bytes32 dataHash, string calldata content) external;
}
