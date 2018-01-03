pragma solidity ^0.4.18;


import './StandardToken.sol';
import '../lifecycle/Ownable.sol';


/**
 * @title Mintable token
 * @dev Simple ERC20 Token example, with mintable token creation
 * @dev Based on code by OpenZeppelin: https://github.com/OpenZeppelin/zeppelin-solidity/blob/v1.4.0/contracts/token/MintableToken.sol
 */

contract MintableToken is StandardToken, Ownable {
    event Mint(address indexed to, uint256 amount);
    event MintFinished();

    bool public mintingFinished = false;

    address public mintAddress;

    modifier canMint() {
        require(!mintingFinished);
        _;
    }

    modifier onlyMint() {
        require(msg.sender == mintAddress);
        _;
    }

    /**
     * @dev Function to change address that is allowed to do emission.
     * @param _mintAddress Address of the emission contract.
     */
    function setMintAddress(address _mintAddress) public onlyOwner {
        require(_mintAddress != address(0));
        mintAddress = _mintAddress;
    }

    /**
     * @dev Function to mint tokens
     * @param _to The address that will receive the minted tokens.
     * @param _amount The amount of tokens to mint.
     * @return A boolean that indicates if the operation was successful.
     */
    function mint(address _to, uint256 _amount) public onlyMint canMint returns (bool) {
        totalSupply = totalSupply.add(_amount);
        balances[_to] = balances[_to].add(_amount);
        Mint(_to, _amount);
        Transfer(address(0), _to, _amount);
        return true;
    }

    /**
     * @dev Function to stop minting new tokens.
     * @return True if the operation was successful.
     */
    function finishMinting() public onlyMint canMint returns (bool) {
        mintingFinished = true;
        MintFinished();
        return true;
    }
}
