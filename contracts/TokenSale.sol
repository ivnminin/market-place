// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/interfaces/IERC20.sol";


contract TokenSale {

    address public owner;
    
    IERC20 public token;

    uint public fundsRequired; 
    bool public isOpen = true;

    event Bought(uint _amount, address indexed _buyer);


    constructor(address _token, uint _amountRequired) {
        token = IERC20(_token);
        fundsRequired = _amountRequired;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not an owner");
        _;
    }

    function withdrawFunds(address payable _to) public onlyOwner {
        require(!isOpen, "no way to withdraw funds");

        (bool sent, bytes memory data) = _to.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    receive() external payable {
        require(isOpen, "sold out");

        uint amount = msg.value;

        require(amount > 0, "not enough funds");
        require(token.balanceOf(address(this)) >= amount, "not enough tokens");

        token.transfer(msg.sender, amount);
        
        emit Bought(amount, msg.sender);

        if (address(this).balance >= fundsRequired) {
            isOpen = false;
        }
    }

}
