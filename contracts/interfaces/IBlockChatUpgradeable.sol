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

    /* ================ STRUCTS ================ */

    struct Message {
        address sender;
        bytes32 recipient;
        string content;
        uint256 createDate;
    }

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() external pure returns (string memory);

    function getRecipientHash(string memory name) external pure returns (bytes32);

    function getSenderMessageListLength(address sender) external view returns (uint256);

    function getRecipientMessageListLength(bytes32 recipient) external view returns (uint256);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes32 recipient, string memory content) external;
}
