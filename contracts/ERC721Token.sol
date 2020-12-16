pragma solidity ^0.7.3;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract ERC721Token is IERC721 {
    using Address for address;

    mapping(address => uint256) private ownerToTokenCount;
    mapping(uint256 => address) private idToOwner;
    mapping(uint256 => address) private idToApproved;
    bytes4 internal constant MAGIC_ON_ERC721_RECEIVED = 0x150b7a02;

    function balanceOf(address _owner) external view returns (uint256) {
        return ownerToTokenCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return idToOwner[_tokenId];
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes calldata data
    ) external payable {
        _safeTransferFrom(_from, _to_, _tokenId, data);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes calldata data
    ) external payable {
        _safeTransferFrom(_from, _to_, _tokenId, "");
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external {
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external {
        address owner = idToOwner[_tokenId];
        require(msg.sender == owner, "Not authorized");
        idToApproved[_tokenId] = _approved;
        emit Approval(owner, _approved, _tokenId);
    }

    function _safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory data
    ) internal {
        _transfer(_from, _to, _tokenId);

        //test that our ethereum address is sc
        if (_to.isContract()) {
            bytes4 retval =
                ERC721TokenReceiver(_to).onERC721Received(
                    msg.sender,
                    _from,
                    _tokenId,
                    data
                );
            require(
                retval == MAGIC_ON_ERC721_RECEIVED,
                "recipient SC cannot handle ERC721 tokens"
            );
        }
    }

    function setApprovalForAll(address _operator, bool _approved) external {

    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal canTransfer(_tokenId) {
        require(msg.sender == _from, "Not authorized to transfer tokens");
        require(
            _from == idToOwner[_tokenId],
            "Not authorized to transfer tokens"
        );
        ownerToTokenCount[_from] -= 1;
        ownerToTokenCount[_to] += 1;
        idToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    modifier canTransfer(uint256 _tokenId) {
        address owner = idToOwner[_tokenId];
        require(
            owner == msg.sender || idToApproved[_tokenId] == msg.sender,
            "Transfer not authorized"
        );
        _;
    }
}
