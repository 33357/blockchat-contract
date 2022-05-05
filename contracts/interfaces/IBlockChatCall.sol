// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IBlockChatCall {
    function blockChatCallBack(address sender) external payable;

    function blockChatCallBackHash(address sender, bytes32 messageHash) external payable;
}
