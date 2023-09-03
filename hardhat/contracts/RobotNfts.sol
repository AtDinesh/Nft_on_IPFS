// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensioons/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RobotNFTs is ERC721Enumerable, Ownable {
    using Strings for uint256;
    /**
    * @dev baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
    * token will be the concatenation of the `baseURI` and the `tokenId`.
    */
    string baseTokenUri;

    // price of each NFT
    uint256 public price = 0.01 ether;

    // pause the contract in case of emergency
    bool public paused;

    // max number of NFTs
    uint256 public maxTokenIds = 9;

    // total number of nfts minted
    uint256 public tokenIds;



}