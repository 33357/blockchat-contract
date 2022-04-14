//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../interfaces/IBlockChatUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BlockChatUpgradeable is IBlockChatUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    mapping(address => uint256[]) public senderMessageListMap;
    mapping(bytes32 => uint256[]) public recipientMessageListMap;
    mapping(uint256 => Message) public messageMap;
    mapping(address => string) public ephemPublicKeyMap;

    uint256 public messageLength;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    /* ================ UTIL FUNCTIONS ================ */

    modifier _onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "BlockChatUpgradeable: require admin permission");
        _;
    }

    function _authorizeUpgrade(address) internal view override _onlyAdmin {}

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() public pure override returns (string memory) {
        return "1.0.0";
    }

    function getRecipientHash(string memory name) public pure override returns (bytes32) {
        return keccak256(abi.encodePacked(name));
    }

    function getSenderMessageListLength(address sender) public view override returns (uint256) {
        return senderMessageListMap[sender].length;
    }

    function getRecipientMessageListLength(bytes32 recipient) public view override returns (uint256) {
        return recipientMessageListMap[recipient].length;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes32 recipient, string memory content) external override {
        messageLength++;
        messageMap[messageLength] = Message(msg.sender, recipient, content, block.timestamp);
        senderMessageListMap[msg.sender].push(messageLength);
        recipientMessageListMap[recipient].push(messageLength);
        emit MessageCreated(messageLength, msg.sender, recipient, content, block.timestamp);
    }

    function uploadEphemPublicKey(string memory ephemPublicKey) external override {
        ephemPublicKeyMap[msg.sender] = ephemPublicKey;
    }
}
