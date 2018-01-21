pragma solidity ^0.4.18;


import "./token/MintableToken.sol";
import "./token/PausableToken.sol";


/**
 * @title CraftyToken
 * @dev CraftyToken is a token contract of Crafty.
 */
contract CraftyToken is MintableToken, PausableToken {
    string public constant name = 'Crafty Token';
    string public constant symbol = 'CFTY';
    uint8 public constant decimals = 8;

    /**
     * @dev CraftyToken constructor
     */
    function CraftyToken() public {
        pause();
    }

}