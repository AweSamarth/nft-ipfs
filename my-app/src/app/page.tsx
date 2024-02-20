"use client";

import Image from "next/image";
import { Contract, providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants/index.js";
import Web3Modal from "web3modal";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  const web3ModalRef = useRef();

  const publicMint = async () => {
    try {
      console.log("Public mint");
      const signer = await getProviderOrSigner(true);

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

      const tx = await nftContract.mint({
        value: utils.parseEther("0.01"),
      });

      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("Successfully minted an LW3Punk. Congratulations!");
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getTokenIdsMinted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      const _tokenIds = await nftContract.tokenIds();
      console.log("tokenIds", _tokenIds);
      setTokenIdsMinted(_tokenIds.toString());
    } catch (error) {
      console.error(error);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    // @ts-ignore
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change the network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };

  useEffect(() => {
    if (!walletConnected) {
      //@ts-ignore
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
      getTokenIdsMinted();

      setInterval(async function () {
        await getTokenIdsMinted();
      }, 5 * 1000);
    }
  }, [walletConnected]);

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button
          onClick={connectWallet}
          className="bg-[#6c63ff] px-4 max-w-40 py-2 rounded-sm"
        >
          Connect your wallet
        </button>
      );
    }

    return (
      <button
        onClick={publicMint}
        className="bg-[#6c63ff] px-4 max-w-40 py-2 rounded-sm"
      >
        Public Mint 🚀
      </button>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Head>
        <title>LW3Punks</title>
        <meta name="description" content="LW3Punks-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center gap-4  text-center">
        <h1 className=" text-3xl">Welcome to LW3Punks!</h1>
        <div>It&#39;s an NFT collection for LearnWeb3 students.</div>
        <div>{tokenIdsMinted}/10 have been minted already</div>
        {renderButton()}
      </div>

      <div className="mt-8">
        <img src="./LW3Punks/1.png" className="w-[40rem]" />
      </div>
      <div></div>
      <footer className=" absolute bottom-0 pb-4 w-full text-center bg-gray-900 ">
        Made with &#10084; by LW3Punks
      </footer>
    </main>
  );
}
