pragma solidity ^0.5.17;
pragma experimental ABIEncoderV2;

import "./ERC721Token.sol";

contract CryptoFantom is ERC721Token {
    struct Fantom {
        uint256 id;
        uint256 generation;
        uint256 geneA;
        uint256 geneB;
    }
    mapping(uint256 => Fantom) public fantoms;
    uint256 public nextId;
    address public admin;

    constructor(string memory _tokenURIBase) public ERC721Token(_tokenURIBase) {
        admin = msg.sender;
    }

    /// @notice Returns all the IDs of all FantomNFTs ever created
    function getAllFantoms() external view returns (Fantom[] memory) {
        Fantom[] memory _fantoms = new Fantom[](nextId);
        for (uint256 i = 0; i < _fantoms.length; i++) {
            _fantoms[i] = fantoms[i];
        }
        return _fantoms;
    }

    /// @notice Returns all FantomNFTs of a specific owner.
    /// @param owner The address of the owner to check.
    function getAllFantomsOf(address owner)
        external
        view
        returns (Fantom[] memory)
    {
        uint256 length;
        for (uint256 i = 0; i < nextId; i++) {
            if (ownerOf(i) == owner) {
                length++;
            }
        }
        Fantom[] memory _fantoms = new Fantom[](length);
        for (uint256 i = 0; i < _fantoms.length; i++) {
            if (ownerOf(i) == owner) {
                _fantoms[i] = fantoms[i];
            }
        }
        return _fantoms;
    }

    /// @dev function to initiate breeding, assumes that all breeding
    /// requirements have been checked.
    function breed(uint256 fantom1Id, uint256 fantom2Id) external {
        require(
            fantom1Id < nextId && fantom2Id < nextId,
            "The 2 fantoms must exist"
        );
        Fantom storage fantom1 = fantoms[fantom1Id];
        Fantom storage fantom2 = fantoms[fantom2Id];
        require(
            ownerOf(fantom1Id) == msg.sender &&
                ownerOf(fantom2Id) == msg.sender,
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

    /// @dev function to create randomly a Fantom NFT
    /// only Admin can call this function
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
