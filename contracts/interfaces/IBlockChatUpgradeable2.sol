// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IBlockChatUpgradeable2 {
    /* ================ EVENTS ================ */

    event MessageCreated(
        uint48 indexed messageId,
        uint48 createDate,
        address indexed sender,
        bytes32[] recipientHashList,
        string content
    );

    event PublicKeyUploaded(address indexed sender, string publicKey);

    /* ================ STRUCTS ================ */

    struct Message {
        bytes26 messageHash;
        uint48 createBlock;
    }

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() external pure returns (string memory);

    function getRecipientHash(string memory name) external pure returns (bytes32);

    function getMessageHash(
        address sender,
        uint48 createDate,
        uint48 createBlock,
        bytes32[] memory recipientHashList,
        string memory content
    ) external pure returns (bytes26);

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
