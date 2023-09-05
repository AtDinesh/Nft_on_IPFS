// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RobotNFTs is ERC721Enumerable, Ownable {
    using Strings for uint256;
    /**
    * @dev baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
    * token will be the concatenation of the `baseURI` and the `tokenId`.
    * base URI is a prefix that, when combined with the tokenId and a file extension (ex: ".json"), 
    * forms the complete URI pointing to the metadata JSON file associated with the token.
    */
    string baseTokenUri;

    // price of each NFT
    uint256 public price = 0.005 ether;

    // pause the contract in case of emergency
    bool public paused;

    // max number of NFTs
    uint256 public maxTokenIds = 9;

    // total number of nfts minted
    uint256 public tokenIds;

    // Modifier to let function work only when contract is not paused
    modifier onlyWhenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    constructor (string memory baseURI) ERC721("RobotNFTs", "RBT") {
        baseTokenUri = baseURI;
    }

    /**
    * @dev mint allows an user to mint 1 NFT per transaction.
    */
    function mint() public payable onlyWhenNotPaused {
        require(tokenIds < maxTokenIds, "Maximum number of NFTs reached");
        require(price <= msg.value, "Please send enough ETH");
        _safeMint(msg.sender, tokenIds);
        tokenIds++;
    }

    /**
    * @dev _baseURI overrides the Openzeppelin's ERC721 default implementation which
    * returned an empty string for the baseURI
    */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenUri;
    }

    /**
    * @dev tokenURI overrides the Openzeppelin's ERC721 implementation.
    * This function returns the URI from where we can extract the metadata for a given tokenId
    */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        // _exists is inherited from ERC721 to verify the token's existence.
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");

        string memory baseUri = _baseURI();

        // If the length of baseUri > 0, then return baseURI + tokenId and the .json
        // so that it knows the location of the metadata file.
        // If baseUri is empty then return an empty string
        return bytes(baseUri).length > 0 ? string(abi.encodePacked(baseUri, tokenId.toString(), ".json")) : "";
    }   

    /**
    * @dev setPaused makes the contract paused or unpaused
    */
    function setPaused(bool _paused) public onlyOwner {
        paused = _paused;
    }

    /**
    * @dev withdraw sends all the ether in the contract
    * to the owner of the contract
    */
    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    // Function to receive Ether
    receive() external payable {}
    // Fallback function called when msg.data is not empty
    fallback() external payable {}
}