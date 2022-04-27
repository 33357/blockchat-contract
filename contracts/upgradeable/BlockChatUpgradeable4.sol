//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../interfaces/IBlockChatUpgradeable4.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BlockChatUpgradeable4 is IBlockChatUpgradeable4, AccessControlUpgradeable, UUPSUpgradeable {
    mapping(bytes20 => uint48[]) public recipientMessageBlockListMap;
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
        return "0.4.0";
    }

    function getRecipientHash(string calldata name) external pure override returns (bytes20) {
        return bytes20(uint160(uint256(keccak256(abi.encodePacked(name)))));
    }

    function getNameHash(address sender, string calldata name) public pure override returns (bytes12) {
        return bytes12(keccak256(abi.encodePacked(sender,name)));
    }

    function getRecipientMessageBlockListLength(bytes20 recipientHash) external view override returns (uint256) {
        return recipientMessageBlockListMap[recipientHash].length;
    }

    function batchRecipientMessageBlock(
        bytes20 recipientHash,
        uint256 start,
        uint256 length
    ) external view override returns (uint48[] memory) {
        uint48[] memory messageHashList = new uint48[](length);
        for (uint256 i = 0; i < length; i++) {
            messageHashList[i] = recipientMessageBlockListMap[recipientHash][start + i];
        }
        return messageHashList;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createMessage(bytes20 recipientHash, string calldata content) public override {
        if (
            recipientMessageBlockListMap[recipientHash].length == 0 ||
            block.number -
                recipientMessageBlockListMap[recipientHash][recipientMessageBlockListMap[recipientHash].length - 1] >
            blockSkip
        ) {
            recipientMessageBlockListMap[recipientHash].push(uint48(block.number));
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
        bytes32 dataHash = abi.encodePacked(msg.sender, nameHash)[1];
        dataBlockMap[dataHash] = block.number;
        emit DataUploaded(dataHash, content);
    }

    /* ================ ADMIN FUNCTIONS ================ */

    function setBlockSkip(uint256 newBlockSkip) external _onlyAdmin {
        blockSkip = newBlockSkip;
    }
}
