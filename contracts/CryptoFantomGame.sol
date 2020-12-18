//SPDX-License-Identifier: MIT

pragma solidity ^0.7.3;

import "./ERC721Token.sol";

contract CryptoFantomGame is ERC721Token {
    struct Fantom {
        uint256 id;
        uint256 generation;
        uint256 geneA;
        uint256 geneB;
    }
    mapping(uint256 => Fantom) public fantoms;
    uint256 public nextId;
    address public admin;

    constructor(string memory _tokenURIBase) ERC721Token(_tokenURIBase) {
        admin = msg.sender;
    }

    function breed(uint256 fantom1Id, uint256 fantom2Id) external {
        require(
            fantom1Id < nextId && fantom2Id < nextId,
            "The 2 fantoms must exist"
        );
        Fantom storage fantom1 = fantoms[fantom1Id];
        Fantom storage fantom2 = fantoms[fantom2Id];
        require(
            ownerOf(fantom1Id) == msg.sender && ownerOf(fantom2Id) == msg.sender,
            "msg.sender must own the 2 fantoms"
        );
        uint256 baseGen =
            fantom1.generation > fantom2.generation
                ? fantom1.generation
                : fantom2.generation;
        uint256 geneA = _random(4) > 1 ? fantom1.geneA : fantom2.geneA;
        uint256 geneB = _random(4) > 1 ? fantom1.geneB : fantom2.geneB;
        fantoms[nextId] = Fantom(nextId, baseGen + 1, geneA, geneB);
        _mint(msg.sender, nextId);
        nextId++;
    }

    function mint() external {
        require(msg.sender == admin, "only admin");
        fantoms[nextId] = Fantom(nextId, 1, _random(10), _random(10));
        _mint(msg.sender, nextId);
        nextId++;
    }

    function _random(uint256 max) internal view returns (uint256) {
        return
            uint256(
                keccak256(abi.encodePacked(block.timestamp, block.difficulty))
            ) % max;
    }
}
