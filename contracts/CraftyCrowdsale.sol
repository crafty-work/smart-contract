pragma solidity ^0.4.18;


import './math/SafeMath.sol';
import './lifecycle/Pausable.sol';
import './token/MintableToken.sol';
import './token/TokenTimelock.sol';


/**
 * @title CraftyCrowdsale
 * @dev CraftyCrowdsale is a contract for managing a Crafty token crowdsale.
 */
contract CraftyCrowdsale is Pausable {
    using SafeMath for uint256;

    // Amount received from each address
    mapping(address => uint256) received;

    // The token being sold
    MintableToken public token;

    // start and end timestamps where investments are allowed (both inclusive)
    uint256 public preSaleStart;
    uint256 public preSaleEnd;
    uint256 public saleStart;
    uint256 public saleEnd;

    // amount of tokens sold
    uint256 public issuedTokens = 0;

    // token cap
    uint256 public constant hardCap = 5000000000 * 10**8; // 50%

    // token wallets
    uint256 constant teamCap = 1450000000 * 10**8; // 14.5%
    uint256 constant advisorCap = 450000000 * 10**8; // 4.5%
    uint256 constant bountyCap = 100000000 * 10**8; // 1%
    uint256 constant fundCap = 3000000000 * 10**8; // 30%

    // Number of days the tokens will be locked
    uint256 constant lockTime = 180 days;

    // wallets
    address public etherWallet;
    address public teamWallet;
    address public advisorWallet;
    address public fundWallet;
    address public bountyWallet;

    // timelocked tokens
    TokenTimelock teamTokens;

    uint256 public rate;

    enum State { BEFORE_START, SALE, REFUND, CLOSED }
    State currentState = State.BEFORE_START;

    /**
     * @dev Event for token purchase logging
     * @param purchaser who paid for the tokens
     * @param beneficiary who got the tokens
     * @param amount amount of tokens purchased
     */
    event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 amount);

    /**
     * @dev Event for refund
     * @param to who sent wei
     * @param amount amount of wei refunded
     */
    event Refund(address indexed to, uint256 amount);

    /**
     * @dev modifier to allow token creation only when the sale is on
     */
    modifier saleIsOn() {
        require(
            (
                (now >= preSaleStart && now < preSaleEnd) || 
                (now >= saleStart && now < saleEnd)
            ) && 
            issuedTokens < hardCap && 
            currentState == State.SALE
        );
        _;
    }

    /**
     * @dev modifier to allow action only before sale
     */
    modifier beforeSale() {
        require( now < preSaleStart);
        _;
    }

    /**
     * @dev modifier that fails if state doesn't match
     */
    modifier inState(State _state) {
        require(currentState == _state);
        _;
    }

    /**
     * @dev CraftyCrowdsale constructor sets the token, period and exchange rate
     * @param _token The address of Crafty Token.
     * @param _preSaleStart The start time of pre-sale.
     * @param _preSaleEnd The end time of pre-sale.
     * @param _saleStart The start time of sale.
     * @param _saleEnd The end time of sale.
     * @param _rate The exchange rate of tokens.
     */
    function CraftyCrowdsale(address _token, uint256 _preSaleStart, uint256 _preSaleEnd, uint256 _saleStart, uint256 _saleEnd, uint256 _rate) public {
        require(_token != address(0));
        require(_preSaleStart < _preSaleEnd && _preSaleEnd < _saleStart && _saleStart < _saleEnd);
        require(_rate > 0);

        token = MintableToken(_token);
        preSaleStart = _preSaleStart;
        preSaleEnd = _preSaleEnd;
        saleStart = _saleStart;
        saleEnd = _saleEnd;
        rate = _rate;
    }

    /**
     * @dev Fallback function can be used to buy tokens
     */
    function () public payable {
        if(msg.sender != owner)
            buyTokens();
    }

    /**
     * @dev Function used to buy tokens
     */
    function buyTokens() public saleIsOn whenNotPaused payable {
        require(msg.sender != address(0));
        require(msg.value >= 20 finney);

        uint256 weiAmount = msg.value;
        uint256 currentRate = getRate(weiAmount);

        // calculate token amount to be created
        uint256 newTokens = weiAmount.mul(currentRate).div(10**18);

        require(issuedTokens.add(newTokens) <= hardCap);
        
        issuedTokens = issuedTokens.add(newTokens);
        received[msg.sender] = received[msg.sender].add(weiAmount);
        token.mint(msg.sender, newTokens);
        TokenPurchase(msg.sender, msg.sender, newTokens);

        etherWallet.transfer(msg.value);
    }

    /**
     * @dev Function used to change the exchange rate.
     * @param _rate The new rate.
     */
    function setRate(uint256 _rate) public onlyOwner beforeSale {
        require(_rate > 0);

        rate = _rate;
    }

    /**
     * @dev Function used to set wallets and enable the sale.
     * @param _etherWallet Address of ether wallet.
     * @param _teamWallet Address of team wallet.
     * @param _advisorWallet Address of advisors wallet.
     * @param _bountyWallet Address of bounty wallet.
     * @param _fundWallet Address of fund wallet.
     */
    function setWallets(address _etherWallet, address _teamWallet, address _advisorWallet, address _bountyWallet, address _fundWallet) public onlyOwner inState(State.BEFORE_START) {
        require(_etherWallet != address(0));
        require(_teamWallet != address(0));
        require(_advisorWallet != address(0));
        require(_bountyWallet != address(0));
        require(_fundWallet != address(0));

        etherWallet = _etherWallet;
        teamWallet = _teamWallet;
        advisorWallet = _advisorWallet;
        bountyWallet = _bountyWallet;
        fundWallet = _fundWallet;

        uint256 releaseTime = saleEnd + lockTime;

        // Mint locked tokens
        teamTokens = new TokenTimelock(token, teamWallet, releaseTime);
        token.mint(teamTokens, teamCap);

        // Mint released tokens
        token.mint(advisorWallet, advisorCap);
        token.mint(bountyWallet, bountyCap);
        token.mint(fundWallet, fundCap);

        currentState = State.SALE;
    }

    /**
     * @dev Generate tokens to specific address, necessary to accept other cryptos.
     * @param beneficiary Address of the beneficiary.
     * @param newTokens Amount of tokens to be minted.
     */
    function generateTokens(address beneficiary, uint256 newTokens) public onlyOwner {
        require(beneficiary != address(0));
        require(newTokens > 0);
        require(issuedTokens.add(newTokens) <= hardCap);

        issuedTokens = issuedTokens.add(newTokens);
        token.mint(beneficiary, newTokens);
        TokenPurchase(msg.sender, beneficiary, newTokens);
    }

    /**
     * @dev Finish crowdsale and token minting.
     */
    function finishCrowdsale() public onlyOwner inState(State.SALE) {
        require(now > saleEnd);
        // tokens not sold to fund
        uint256 unspentTokens = hardCap.sub(issuedTokens);
        token.mint(fundWallet, unspentTokens);

        currentState = State.CLOSED;

        token.finishMinting();
    }

    /**
     * @dev Enable refund after sale.
     */
    function enableRefund() public onlyOwner inState(State.CLOSED) {
        currentState = State.REFUND;
    }

    /**
     * @dev Check the amount of wei received by beneficiary.
     * @param beneficiary Address of beneficiary.
     */
    function receivedFrom(address beneficiary) public view returns (uint256) {
        return received[beneficiary];
    }

    /**
     * @dev Function used to claim wei if refund is enabled.
     */
    function claimRefund() public whenNotPaused inState(State.REFUND) {
        require(received[msg.sender] > 0);

        uint256 amount = received[msg.sender];
        received[msg.sender] = 0;
        msg.sender.transfer(amount);
        Refund(msg.sender, amount);
    }

    /**
     * @dev Function used to release token of team wallet.
     */
    function releaseTeamTokens() public {
        teamTokens.release();
    }

    /**
     * @dev Function used to reclaim ether by owner.
     */
    function reclaimEther() public onlyOwner {
        owner.transfer(this.balance);
    }

    /**
     * @dev Get exchange rate based on time and amount.
     * @param amount Amount received.
     * @return An uint256 representing the exchange rate.
     */
    function getRate(uint256 amount) internal view returns (uint256) {
        if(now < preSaleEnd) {
            require(amount >= 6797 finney);

            if(amount <= 8156 finney)
                return rate.mul(105).div(100);
            if(amount <= 9515 finney)
                return rate.mul(1055).div(1000);
            if(amount <= 10874 finney)
                return rate.mul(1065).div(1000);
            if(amount <= 12234 finney)
                return rate.mul(108).div(100);
            if(amount <= 13593 finney)
                return rate.mul(110).div(100);
            if(amount <= 27185 finney)
                return rate.mul(113).div(100);
            if(amount > 27185 finney)
                return rate.mul(120).div(100);
        }

        return rate;
    }
}
