//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../interfaces/IBlockChatUpgradeable5.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BlockChatUpgradeable5 is IBlockChatUpgradeable5, AccessControlUpgradeable, UUPSUpgradeable {
    mapping(bytes32 => uint256) public recipientMessageBlockMap;
    mapping(bytes32 => uint256) public dataBlockMap;

    uint256 public blockSkip;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        blockSkip = 50;
    }

    /* ================ UTIL FUNCTIONS ================ */

    modifier _onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "BlockChatUpgradeable2: require admin permission");
        _;
    }

    function _authorizeUpgrade(address) internal view override _onlyAdmin {}

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() external pure override returns (string memory) {
        return "0.5.0";
    }

    function getRecipientHash(string calldata name) external pure override returns (bytes20) {
        return bytes20(uint160(uint256(keccak256(abi.encodePacked(name)))));
    }

    function getNameHash(string calldata name) public pure override returns (bytes12) {
        return bytes12(keccak256(abi.encodePacked(name)));
    }

    function getRecipientIndexHash(bytes20 recipient, uint96 index) public pure returns (bytes32) {
        return bytes32(abi.encodePacked(recipient, index));
    }

    function getRecipientMessageBlockListLength(bytes20 recipientHash) public view override returns (uint96) {
        return uint96(recipientMessageBlockMap[getRecipientIndexHash(recipientHash, type(uint96).max)]);
    }

    function batchRecipientMessageBlock(
        bytes20 recipientHash,
        uint96 start,
        uint96 length
    ) external view override returns (uint256[] memory) {
        uint256[] memory messageHashList = new uint256[](length);
        for (uint96 i = 0; i < length; i++) {
            messageHashList[i] = recipientMessageBlockMap[getRecipientIndexHash(recipientHash, start + i)];
        }
        return messageHashList;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes20 recipientHash, string calldata content) public override {
        uint96 length = getRecipientMessageBlockListLength(recipientHash);
        if (
            length == 0 ||
            block.number - recipientMessageBlockMap[getRecipientIndexHash(recipientHash, length - 1)] > blockSkip
        ) {
            recipientMessageBlockMap[getRecipientIndexHash(recipientHash, length)] = block.number;
            recipientMessageBlockMap[getRecipientIndexHash(recipientHash, type(uint96).max)]++;
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

    function setBlockSkip(uint256 newBlockSkip) external _onlyAdmin {
        blockSkip = newBlockSkip;
    }
}
