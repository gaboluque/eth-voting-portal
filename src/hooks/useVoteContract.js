import {ethers} from "ethers";
import {abi} from "../eth/utils/VotePortal.json";
import {useEffect, useState} from "react";

const contractAddress = "0x7Df00C8855aB907CFe058c6375f56B21bad5720c";

export const useVoteContract = () => {
  const [contract, setContract] = useState(null);

  const getContract = () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const votePortalContract = new ethers.Contract(contractAddress, abi, signer);

        setContract(votePortalContract)
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  useEffect(() => {
    getContract();
  }, []);

  return {contractReady: !!contract, contract}
}