// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IBlockChatUpgradeable2 {
    /* ================ EVENTS ================ */

    event MessageCreated(
        uint48 indexed messageId,
        uint48 createDate,
        address indexed sender,
        bytes20[] indexed recipientHashList,
        string content
    );

    event DataUploaded(address indexed sender, uint48 indexed messageId);

    /* ================ STRUCTS ================ */

    struct Message {
        bytes26 messageHash;
        uint48 createBlock;
    }

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() external pure returns (string memory);

    function getRecipientHash(string memory name) external pure returns (bytes20);

    function getMessageHash(
        address sender,
        uint48 createDate,
        uint48 createBlock,
        bytes20[] memory recipientHashList,
        string calldata content
    ) external pure returns (bytes26);

    function getDataHash(string calldata name) external pure returns (bytes32);

    function getRecipientMessageListLength(bytes20 recipient) external view returns (uint48);

    function batchRecipientMessageId(
        bytes20 recipientHash,
        uint48 start,
        uint48 length
    ) external view returns (uint48[] memory);

    function batchMessage(uint48[] calldata messageIdList) external view returns (Message[] memory);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes20 recipientHash, string calldata content) external returns (uint48);

    function createMessageToList(bytes20[] calldata recipientHashList, string calldata content)
        external
        returns (uint48);

    function createMessageWithData(
        bytes20 recipientHash,
        string calldata content,
        bytes calldata data
    ) external returns (uint48);

    function uploadData(bytes32 dataHash, string calldata content) external returns (uint48);
}
