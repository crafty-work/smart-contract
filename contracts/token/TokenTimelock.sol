pragma solidity ^0.4.18;


import './ERC20Basic.sol';


/**
 * @title TokenTimelock
 * @dev TokenTimelock is a token holder contract that will allow a
 * beneficiary to extract the tokens after a given release time
 * @dev Based on code by OpenZeppelin: https://github.com/OpenZeppelin/zeppelin-solidity/blob/v1.4.0/contracts/token/TokenTimelock.sol
 */
contract TokenTimelock {
    // ERC20 basic token contract being held
    ERC20Basic public token;

    // beneficiary of tokens after they are released
    address public beneficiary;

    // timestamp when token release is enabled
    uint256 public releaseTime;

    /**
     * @dev The TokenTimelock constructor sets token address, beneficiary and time to release.
     * @param _token Address of the token
     * @param _beneficiary Address that will receive the tokens after release
     * @param _releaseTime Time that will allow release the tokens
     */
    function TokenTimelock(ERC20Basic _token, address _beneficiary, uint256 _releaseTime) public {
        require(_releaseTime > now);
        token = _token;
        beneficiary = _beneficiary;
        releaseTime = _releaseTime;
    }

    /**
     * @dev Transfers tokens held by timelock to beneficiary.
     */
    function release() public {
        require(now >= releaseTime);

        uint256 amount = token.balanceOf(this);
        require(amount > 0);

        token.transfer(beneficiary, amount);
    }
}