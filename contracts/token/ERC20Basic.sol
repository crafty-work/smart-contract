pragma solidity ^0.4.18;


/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/179
 * @dev Based on code by OpenZeppelin: https://github.com/OpenZeppelin/zeppelin-solidity/blob/v1.4.0/contracts/token/ERC20Basic.sol
 */
contract ERC20Basic {
    uint256 public totalSupply;

    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
}
