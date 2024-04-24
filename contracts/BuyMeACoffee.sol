// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;



contract Lock {
    // event to emit when memo is created 
    event NewMemo(
        address from,
        uint256 timestamp,
        string name ,
        string message
    );

    // memo struct 
    struct Memo{
        address from;
        uint256 timestamp;
        string name ;
        string message;
    }

    // list of all memo
    Memo[] memos;

// address if contract deployer 
    address payable owner;

    constructor(){
        owner = payable(msg.sender);

    }


// buy a coffee for contract owner 
    fucntion buyCoffee(string memory _name,string memory _message) public payable {
        require(msg.value > 0,"cant buy coffee with zero eth");
        memos.push(
            Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
            )
        );
        emit NewMemo(
             msg.sender,
             block.timestamp,
            _name,
            _message
        );
    }



}
