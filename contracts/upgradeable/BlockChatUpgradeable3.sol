//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../interfaces/IBlockChatUpgradeable3.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BlockChatUpgradeable3 is IBlockChatUpgradeable3, AccessControlUpgradeable, UUPSUpgradeable {
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
        return "0.3.0";
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
        bytes20[] memory recipientHashList,
        string calldata content
    ) public pure override returns (bytes32) {
        return keccak256(abi.encodePacked(sender, createDate, recipientHashList, content));
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes20 recipientHash, string calldata content) public override returns (bytes32) {
        bytes20[] memory recipientHashList = new bytes20[](1);
        recipientHashList[0] = recipientHash;
        return createMessageToList(recipientHashList, content);
    }
        
    function createMessageToList(bytes20[] memory recipientHashList, string calldata content)
        public
        override
        returns (bytes32)
    {
        bytes32 messageHash = getMessageHash(msg.sender, uint48(block.timestamp), recipientHashList, content);
        emit MessageCreated(messageHash, uint48(block.timestamp), msg.sender, recipientHashList, content);
        return messageHash;
    }

    function createMessageWithData(
        bytes20 recipientHash,
        string calldata content,
        bytes calldata data
    ) external override returns (bytes32) {
        (bool success, ) = address(recipientHash).call(data);
        require(success, "BlockChatUpgradeable2: call error");
        return createMessage(recipientHash, content);
    }

    function uploadData(bytes32 dataHash, string calldata content) external override returns (bytes32) {
        bytes32 messageHash = createMessage(bytes20(msg.sender), content);
        emit DataUploaded(msg.sender, dataHash, messageHash);
        return messageHash;
    }
}
