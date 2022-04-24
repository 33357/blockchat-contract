// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IBlockChatUpgradeable2 {
    /* ================ EVENTS ================ */

    event MessageCreated(
        uint256 indexed messageId,
        address indexed sender,
        bytes32[] recipientHashList,
        string content,
        uint256 createDate
    );

    event PublicKeyUploaded(address indexed sender, string publicKey);

    /* ================ STRUCTS ================ */

    struct Message {
        bytes32 messageHash;
        uint256 createBlock;
    }

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() external pure returns (string memory);

    function getRecipientHash(string memory name) external pure returns (bytes32);

    function getMessageHash(
        address sender,
        bytes32[] memory recipientHashList,
        string memory content,
        uint256 createDate
    ) external pure returns (bytes32);

    function getRecipientMessageListLength(bytes32 recipient) external view returns (uint256);

    function batchRecipientMessageId(
        bytes32 recipientHash,
        uint256 start,
        uint256 length
    ) external view returns (uint256[] memory);

    function batchMessage(uint256[] memory messageIdList) external view returns (Message[] memory);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes32[] memory recipientHashList, string memory content) external;

    function uploadPublicKey(string memory publicKey) external;
}
