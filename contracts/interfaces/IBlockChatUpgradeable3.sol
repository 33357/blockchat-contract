// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IBlockChatUpgradeable3 {
    /* ================ EVENTS ================ */

    event MessageCreated(
        bytes32 indexed messageHash,
        uint48 createDate,
        address indexed sender,
        bytes20[] indexed recipientHashList,
        string content
    );

    event DataUploaded(address indexed sender, bytes32 indexed dataHash, bytes32 indexed messageHash);

    /* ================ STRUCTS ================ */

    struct Message {
        bytes26 messageHash;
        uint48 createBlock;
    }

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() external pure returns (string memory);

    function getRecipientHash(string memory name) external pure returns (bytes20);

    function getDataHash(string calldata name) external pure returns (bytes32);

    function getMessageHash(
        address sender,
        uint48 createDate,
        bytes20[] memory recipientHashList,
        string calldata content
    ) external pure returns (bytes32);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes20 recipientHash, string calldata content) external returns (bytes32);

    function createMessageToList(bytes20[] calldata recipientHashList, string calldata content)
        external
        returns (bytes32);

    function createMessageWithData(
        bytes20 recipientHash,
        string calldata content,
        bytes calldata data
    ) external returns (bytes32);

    function uploadData(bytes32 dataHash, string calldata content) external returns (bytes32);
}
