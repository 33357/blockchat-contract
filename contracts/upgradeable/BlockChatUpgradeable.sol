//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../interfaces/IBlockChatUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BlockChatUpgradeable is IBlockChatUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    mapping(bytes20 => uint48[]) public recipientMessageBlockListMap;
    mapping(bytes32 => uint48) public dataBlockMap;
    uint48 public blockSkip;

    mapping(bytes32 => bool) public messageHashMap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        blockSkip = 5000;
    }

    /* ================ UTIL FUNCTIONS ================ */

    modifier _onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "BlockChatUpgradeable2: require admin permission");
        _;
    }

    function _authorizeUpgrade(address) internal view override _onlyAdmin {}

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() external pure override returns (string memory) {
        return "1.0.1";
    }

    function getRecipientHash(string calldata name) external pure override returns (bytes20) {
        return bytes20(uint160(uint256(keccak256(abi.encodePacked(name)))));
    }

    function getNameHash(string calldata name) public pure override returns (bytes12) {
        return bytes12(keccak256(abi.encodePacked(name)));
    }

    function getMessageHash(
        address sender,
        bytes20 recipientHash,
        uint48 createDate,
        string calldata content
    ) public pure override returns (bytes32) {
        return keccak256(abi.encodePacked(sender, recipientHash, createDate, content));
    }

    function getRecipientMessageBlockListLength(bytes20 recipientHash) external view override returns (uint48) {
        return uint48(recipientMessageBlockListMap[recipientHash].length);
    }

    function batchRecipientMessageBlock(
        bytes20 recipientHash,
        uint48 start,
        uint48 length
    ) external view override returns (uint48[] memory) {
        uint48[] memory messageHashList = new uint48[](length);
        for (uint48 i = 0; i < length; i++) {
            messageHashList[i] = recipientMessageBlockListMap[recipientHash][start + i];
        }
        return messageHashList;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes20 recipientHash, string calldata content) public override {
        uint48[] memory messageBlockList = recipientMessageBlockListMap[recipientHash];
        if (
            messageBlockList.length == 0 ||
            uint48(block.number) - messageBlockList[messageBlockList.length - 1] > blockSkip
        ) {
            recipientMessageBlockListMap[recipientHash].push(uint48(block.number));
        }
        emit MessageCreated(msg.sender, recipientHash, uint48(block.timestamp), content);
    }

    function createMessageCall(
        bytes20 recipientHash,
        string calldata content,
        uint256 value,
        bytes calldata data
    ) external payable override {
        (bool success, ) = address(recipientHash).call{value: value}(data);
        require(success, "BlockChatUpgradeable2: call error");
        createMessage(recipientHash, content);
    }

    function createMessageHash(bytes20 recipientHash, string calldata content) public override {
        bytes32 messageHash = getMessageHash(msg.sender, recipientHash, uint48(block.timestamp), content);
        messageHashMap[messageHash] = true;
        createMessage(recipientHash, content);
    }

    function createMessageHashAndCall(
        bytes20 recipientHash,
        string calldata content,
        uint256 value,
        bytes calldata data
    ) external payable override {
        createMessageHash(recipientHash, content);
        (bool success, ) = address(recipientHash).call{value: value}(data);
        require(success, "BlockChatUpgradeable2: call error");
    }

    function uploadData(bytes12 nameHash, string calldata content) external override {
        bytes32 dataHash = bytes32(abi.encodePacked(msg.sender, nameHash));
        dataBlockMap[dataHash] = uint48(block.number);
        emit DataUploaded(dataHash, content);
    }

    /* ================ ADMIN FUNCTIONS ================ */

    function setBlockSkip(uint48 newBlockSkip) external _onlyAdmin {
        blockSkip = newBlockSkip;
    }
}
