//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../interfaces/IBlockChatUpgradeable.sol";
import "../interfaces/IBlockChatCall.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BlockChatUpgradeable is IBlockChatUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    mapping(bytes20 => uint48[]) public recipientMessageBlockListMap;
    mapping(bytes32 => uint48) public dataBlockMap;
    uint48 public blockSkip;

    mapping(bytes32 => bool) public messageHashMap;
    mapping(address => uint48[]) public senderMessageBlockListMap;

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

    function _toSender(address sender, uint48 blockNumber) internal {
        uint48[] memory senderMessageBlockList = senderMessageBlockListMap[sender];
        if (
            senderMessageBlockList.length == 0 ||
            blockNumber - senderMessageBlockList[senderMessageBlockList.length - 1] > blockSkip
        ) {
            senderMessageBlockListMap[sender].push(blockNumber);
        }
    }

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

    function batchSenderMessageBlock(
        address sender,
        uint48 start,
        uint48 length
    ) external view override returns (uint48[] memory) {
        uint48[] memory messageHashList = new uint48[](length);
        for (uint48 i = 0; i < length; i++) {
            messageHashList[i] = senderMessageBlockListMap[sender][start + i];
        }
        return messageHashList;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(
        bytes20 recipientHash,
        string calldata content,
        bool isToSender
    ) public override {
        uint48[] memory recipientMessageBlockList = recipientMessageBlockListMap[recipientHash];
        uint48 blockNumber = uint48(block.number);
        address sender = msg.sender;
        if (
            recipientMessageBlockList.length == 0 ||
            blockNumber - recipientMessageBlockList[recipientMessageBlockList.length - 1] > blockSkip
        ) {
            recipientMessageBlockListMap[recipientHash].push(blockNumber);
        }
        if (isToSender) {
            _toSender(sender, blockNumber);
        }
        emit MessageCreated(sender, recipientHash, uint48(block.timestamp), content);
    }

    function createMessageCall(
        bytes20 recipientHash,
        string calldata content,
        bool isToSender,
        bytes calldata data
    ) external payable override {
        bool success;
        if (msg.value > 0) {
            (success, ) = address(recipientHash).call{value: msg.value}(data);
        } else {
            (success, ) = address(recipientHash).call(data);
        }
        require(success, "BlockChatUpgradeable: call failed");
        createMessage(recipientHash, content, isToSender);
    }

    function createMessageCallBack(
        bytes20 recipientHash,
        string calldata content,
        bool isToSender
    ) external payable override {
        bytes32 messageHash = getMessageHash(msg.sender, recipientHash, uint48(block.timestamp), content);
        if (msg.value > 0) {
            IBlockChatCall(address(recipientHash)).blockChatCallBackHash{value: msg.value}(msg.sender, messageHash);
        } else {
            IBlockChatCall(address(recipientHash)).blockChatCallBackHash(msg.sender, messageHash);
        }
        createMessage(recipientHash, content, isToSender);
    }

    function createMessageHash(
        bytes20 recipientHash,
        string calldata content,
        bool isToSender
    ) public override {
        bytes32 messageHash = getMessageHash(msg.sender, recipientHash, uint48(block.timestamp), content);
        messageHashMap[messageHash] = true;
        createMessage(recipientHash, content, isToSender);
    }

    function createMessageHashAndCallBack(
        bytes20 recipientHash,
        string calldata content,
        bool isToSender
    ) external payable override {
        createMessageHash(recipientHash, content, isToSender);
        if (msg.value > 0) {
            IBlockChatCall(address(recipientHash)).blockChatCallBack{value: msg.value}(msg.sender);
        } else {
            IBlockChatCall(address(recipientHash)).blockChatCallBack(msg.sender);
        }
    }

    function createMessageHashAndCall(
        bytes20 recipientHash,
        string calldata content,
        bool isToSender,
        bytes calldata data
    ) external payable override {
        bool success;
        if (msg.value > 0) {
            (success, ) = address(recipientHash).call{value: msg.value}(data);
        } else {
            (success, ) = address(recipientHash).call(data);
        }
        require(success, "BlockChatUpgradeable: call failed");
        createMessageHash(recipientHash, content, isToSender);
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
