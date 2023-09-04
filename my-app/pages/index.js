import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { Contract, providers, utils } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  // tokenIdsMinted keeps track of the number of tokenIds that have been minted
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Mumbai network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  // Mint an NFT
  const publicMint = async () => {
    try {
      console.log("Public Mint");
      // Minting requires writing a transaction --> need a signer
      const signer = await getProviderOrSigner(true);
      // Create an instance of the contract with the signer
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      // Call the mint function from the contract
      const tx = await nftContract.mint({ value: utils.parseEther("0.005") });
      // Wait for transaction to be mined.
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("RobotNFT minted !")
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      // Get Provider (metamask)
      await getProviderOrSigner(false);
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Get the number of token minted in the contract
  const getTokenMintedCount = async () => {
    try {
      // Get the provider (metamask)
      const provider = await getProviderOrSigner(false);
      // connect to the contract
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      // call tokenIds() function of the contract
      const _tokenIds = await nftContract.tokenIds();
      console.log("Number of NFT minted so far: ", _tokenIds);
      setTokenIdsMinted(_tokenIds.toString());
    } catch (err) {
      console.error(err);
    }
  };

  // useEffects are used to react to changes in state of the website
  useEffect(() => {
    // IF wallet is not connected, create instance of web3modal and connect metamask
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
      getTokenMintedCount(); // initialize the count of number of tokens minted

      // regularly fetch this count to update display
      setInterval( async function () {
        await getTokenMintedCount();
      }, 5 * 1000);
    }
  }, [walletConnected]);

  // render a button based on the state of the app
  const renderButton = () => {
    // If wallet is not connected, display connectWallet button
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet.
        </button>
      );
    }

    if (loading) {
      return (
        <button className={styles.button}>
          Loading...
        </button>
      );
    }

    // Otherwise give ability to mint NFT
    return (
      <button onClick={publicMint} className={styles.button}>
        Mint an NFT 🤖
      </button>
    );
  };

  return (
    <div>
      <Head>
        <title>RobotNFTs</title>
        <meta name="description" content="RobotNFTs-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to RobotNFTs!</h1>
          <div className={styles.description}>
            {/* Using HTML Entities for the apostrophe */}
            It&#39;s a simple NFT collection using IPFS.
          </div>
          <div className={styles.description}>
            {tokenIdsMinted}/9 have been minted
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./RobotNFTs/1.gif" />
        </div>
      </div>

      <footer className={styles.footer}>Learning content</footer>
    </div>
  );
}