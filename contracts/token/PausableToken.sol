pragma solidity ^0.4.18;


import './StandardToken.sol';
import '../lifecycle/Pausable.sol';


/**
 * @title Pausable token
 * @dev StandardToken modified with pausable transfers.
 * @dev Based on code by OpenZeppelin: https://github.com/OpenZeppelin/zeppelin-solidity/blob/v1.4.0/contracts/token/PausableToken.sol
 **/
contract PausableToken is StandardToken, Pausable {
	/**
    * @dev Transfer token for a specified address
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    * @return A boolean that indicates if the operation was successful.
    */
    function transfer(address _to, uint256 _value) public whenNotPaused returns (bool) {
        return super.transfer(_to, _value);
    }

    /**
     * @dev Transfer tokens from one address to another
     * @param _from address The address which you want to send tokens from
     * @param _to address The address which you want to transfer to
     * @param _value uint256 the amount of tokens to be transferred
     * @return A boolean that indicates if the operation was successful.
     */
    function transferFrom(address _from, address _to, uint256 _value) public whenNotPaused returns (bool) {
        return super.transferFrom(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) public whenNotPaused returns (bool) {
        return super.approve(_spender, _value);
    }
}
