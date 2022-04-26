//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../interfaces/IBlockChatUpgradeable2.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BlockChatUpgradeable2 is IBlockChatUpgradeable2, AccessControlUpgradeable, UUPSUpgradeable {
    mapping(bytes20 => uint48[]) public recipientMessageListMap;
    mapping(uint48 => Message) public messageMap;
    uint48 public messageLength;

    mapping(address => mapping(bytes32 => uint48)) public dataMap;

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

    function implementationVersion() external pure override returns (string memory) {
        return "0.2.5";
    }

    function getRecipientHash(string calldata name) external pure override returns (bytes20) {
        return bytes20(uint160(uint256(keccak256(abi.encodePacked(name)))));
    }

    function getDataHash(string calldata name) external pure override returns (bytes32) {
        return keccak256(abi.encodePacked(name));
    }

    function getMessageHash(
        address sender,
        uint48 createDate,
        uint48 createBlock,
        bytes20[] memory recipientHashList,
        string calldata content
    ) public pure override returns (bytes26) {
        return
            bytes26(
                uint208(
                    uint256(keccak256(abi.encodePacked(sender, createDate, createBlock, recipientHashList, content)))
                )
            );
    }

    function getRecipientMessageListLength(bytes20 recipientHash) external view override returns (uint48) {
        return uint48(recipientMessageListMap[recipientHash].length);
    }

    function batchRecipientMessageId(
        bytes20 recipientHash,
        uint48 start,
        uint48 length
    ) external view override returns (uint48[] memory) {
        uint48[] memory messageIdList = new uint48[](length);
        for (uint256 i = 0; i < length; i++) {
            messageIdList[i] = recipientMessageListMap[recipientHash][start + i];
        }
        return messageIdList;
    }

    function batchMessage(uint48[] calldata messageIdList) external view override returns (Message[] memory) {
        Message[] memory messageList = new Message[](messageIdList.length);
        for (uint48 i = 0; i < messageIdList.length; i++) {
            messageList[i] = messageMap[messageIdList[i]];
        }
        return messageList;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes20 recipientHash, string calldata content) public override returns (uint48) {
        bytes20[] memory recipientHashList = new bytes20[](1);
        recipientHashList[0] = recipientHash;
        messageLength++;
        messageMap[messageLength] = Message(
            getMessageHash(msg.sender, uint48(block.timestamp), uint48(block.number), recipientHashList, content),
            uint48(block.number)
        );
        recipientMessageListMap[recipientHash].push(messageLength);
        emit MessageCreated(messageLength, uint48(block.timestamp), msg.sender, recipientHashList, content);
        return messageLength;
    }

    function createMessageToList(bytes20[] calldata recipientHashList, string calldata content)
        external
        override
        returns (uint48)
    {
        messageLength++;
        messageMap[messageLength] = Message(
            getMessageHash(msg.sender, uint48(block.timestamp), uint48(block.number), recipientHashList, content),
            uint48(block.number)
        );
        for (uint256 i = 0; i < recipientHashList.length; i++) {
            recipientMessageListMap[recipientHashList[i]].push(messageLength);
        }
        emit MessageCreated(messageLength, uint48(block.timestamp), msg.sender, recipientHashList, content);
        return messageLength;
    }

    function createMessageWithData(
        bytes20 recipientHash,
        string calldata content,
        bytes calldata data
    ) external override returns (uint48) {
        (bool success, ) = address(recipientHash).call(data);
        require(success, "BlockChatUpgradeable2: call error");
        bytes20[] memory recipientHashList = new bytes20[](1);
        recipientHashList[0] = recipientHash;
        messageLength++;
        messageMap[messageLength] = Message(
            getMessageHash(msg.sender, uint48(block.timestamp), uint48(block.number), recipientHashList, content),
            uint48(block.number)
        );
        recipientMessageListMap[recipientHash].push(messageLength);
        emit MessageCreated(messageLength, uint48(block.timestamp), msg.sender, recipientHashList, content);
        return messageLength;
    }

    function uploadData(bytes32 dataHash, string calldata content) external override returns (uint48) {
        uint48 messageId = createMessage(bytes20(msg.sender), content);
        dataMap[msg.sender][dataHash] = messageId;
        emit DataUploaded(msg.sender, messageId);
        return messageId;
    }
}
