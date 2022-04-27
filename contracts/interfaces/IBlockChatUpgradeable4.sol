// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IBlockChatUpgradeable4 {
    /* ================ EVENTS ================ */

    event MessageCreated(
        address indexed sender,
        bytes20 indexed recipientHash,
        uint48 createDate,
        string content
    );

    event DataUploaded(address indexed sender, bytes32 indexed dataHash, string content);

    /* ================ STRUCTS ================ */

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() external pure returns (string memory);

    function getRecipientHash(string memory name) external pure returns (bytes20);

    function getDataHash(string calldata name) external pure returns (bytes32);

    function getRecipientMessageBlockListLength(bytes20 recipientHash) external view returns (uint256);

    function batchRecipientMessageBlock(
        bytes20 recipientHash,
        uint256 start,
        uint256 length
    ) external view returns (uint48[] memory) ;

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes20 recipientHash, string calldata content) external;

    function createMessageWithData(
        bytes20 recipientHash,
        string calldata content,
        bytes calldata data
    ) external;

    function uploadData(bytes32 dataHash, string calldata content) external;
}
