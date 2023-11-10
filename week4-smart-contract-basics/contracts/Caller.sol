// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ILottery {
    function attempt() external;
}

contract Caller {
    constructor() {}

    function callAttempt(address lottery) external {
        ILottery(lottery).attempt();
    }
}
