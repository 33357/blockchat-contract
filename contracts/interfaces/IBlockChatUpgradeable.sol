// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IBlockChatUpgradeable {
    /* ================ EVENTS ================ */

    event MessageCreated(
        uint256 indexed messageId,
        address indexed sender,
        bytes32 indexed recipient,
        string content,
        uint256 createDate
    );

    event MessageCreatedToRecipientList(
        uint256 indexed messageId,
        address indexed sender,
        bytes32[] indexed recipientList,
        string content,
        uint256 createDate
    );

    event PublicKeyUploaded(address indexed sender, string publicKey);

    /* ================ STRUCTS ================ */

    struct Message {
        address sender;
        bytes32 recipient;
        string content;
        uint256 createDate;
    }

    struct MessageToRecipientList {
        address sender;
        bytes32[] recipientList;
        string content;
        uint256 createDate;
    }

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() external pure returns (string memory);

    function getRecipientHash(string memory name) external pure returns (bytes32);

    function getSenderMessageListLength(address sender) external view returns (uint256);

    function getRecipientMessageListLength(bytes32 recipient) external view returns (uint256);

    function batchSenderMessageId(
        address sender,
        uint256 start,
        uint256 length
    ) external view returns (uint256[] memory);

    function batchRecipientMessageId(
        bytes32 recipient,
        uint256 start,
        uint256 length
    ) external view returns (uint256[] memory);

    function batchMessage(uint256[] memory messageIdList)
        external
        view
        returns (Message[] memory, MessageToRecipientList[] memory);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes32 recipient, string memory content) external;

    function createMessageToRecipientList(bytes32[] memory recipientList, string memory content) external;

    function uploadPublicKey(string memory publicKey) external;
}
