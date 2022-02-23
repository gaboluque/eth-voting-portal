import {ethers} from "ethers";
import {abi} from "../eth/utils/VotePortal.json";
import {useEffect, useState} from "react";

const contractAddress = "0xAB962873adF20Cf035f0Fb0262e2513725711A19";

const formatOptions = (options) => options.map(({count, option}) => ({option, count: count.toNumber()}));

export const useVoteContract = (setOptions, setLoading) => {
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

  const getOptions = async () => {
    let newOptions = [];
    if (contract) {
      try {
        let options = await contract.getVotes();
        newOptions = formatOptions(options);
      } catch (error) {
        console.log(error);
      }
    }
    setOptions(newOptions);
  }

  /**
   * Listen in for emitter events!
   */
  useEffect(() => {
    if (contract) {contract.on("NewVote", getOptions);}

    return () => {
      if (contract) {
        contract.off("NewWave", getOptions);
      }
    };
  }, [contract]);

  const vote = async (optionIndex) => {
    if (contract) {
      try {
        setLoading(true);
        const tx = await contract.vote(optionIndex, { gasLimit: 300000 });
        await tx.wait();
        await getOptions();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  return {getOptions, contract, vote}
}