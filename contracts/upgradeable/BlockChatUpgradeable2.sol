//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../interfaces/IBlockChatUpgradeable2.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BlockChatUpgradeable2 is IBlockChatUpgradeable2, AccessControlUpgradeable, UUPSUpgradeable {
    mapping(bytes32 => uint48[]) public recipientMessageListMap;
    mapping(uint256 => Message) public messageMap;
    uint48 public messageLength;

    mapping(address => string) public publicKeyMap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    /* ================ UTIL FUNCTIONS ================ */

    modifier _onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "BlockChatUpgradeable2: require admin permission");
        _;
    }

    function _authorizeUpgrade(address) internal view override _onlyAdmin {}

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() public pure override returns (string memory) {
        return "2.2.0";
    }

    function getRecipientHash(string memory name) public pure override returns (bytes32) {
        return keccak256(abi.encodePacked(name));
    }

    function getMessageHash(
        address sender,
        uint48 createDate,
        uint48 createBlock,
        bytes32[] memory recipientHashList,
        string memory content
    ) public pure override returns (bytes26) {
        return bytes26(keccak256(abi.encodePacked(sender, createDate, createBlock, recipientHashList, content)));
    }

    function getRecipientMessageListLength(bytes32 recipientHash) public view override returns (uint256) {
        return recipientMessageListMap[recipientHash].length;
    }

    function batchRecipientMessageId(
        bytes32 recipientHash,
        uint256 start,
        uint256 length
    ) external view override returns (uint256[] memory) {
        uint256[] memory messageIdList = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            messageIdList[i] = recipientMessageListMap[recipientHash][start + i];
        }
        return messageIdList;
    }

    function batchMessage(uint256[] memory messageIdList) external view override returns (Message[] memory) {
        Message[] memory messageList = new Message[](messageIdList.length);
        for (uint256 i = 0; i < messageIdList.length; i++) {
            messageList[i] = messageMap[messageIdList[i]];
        }
        return messageList;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes32[] memory recipientHashList, string memory content) external override {
        messageLength++;
        messageMap[messageLength] = Message(
            getMessageHash(msg.sender, uint48(block.timestamp), uint48(block.number), recipientHashList, content),
            uint48(block.number)
        );
        for (uint256 i = 0; i < recipientHashList.length; i++) {
            recipientMessageListMap[recipientHashList[i]].push(messageLength);
        }
        emit MessageCreated(messageLength, uint48(block.timestamp), msg.sender, recipientHashList, content);
    }

    function uploadPublicKey(string memory publicKey) external override {
        publicKeyMap[msg.sender] = publicKey;
        emit PublicKeyUploaded(msg.sender, publicKey);
    }
}
