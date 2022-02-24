import {ethers} from "ethers";
import {abi} from "../eth/utils/VotePortal.json";
import {useEffect, useState} from "react";

const contractAddress = "0x07745c64D4313e9D0Edb83d8B37F69Ab269E945e";

const formatOptions = (options) => options.map(({count, name, description}) => {
  return {name, description, count: count.toNumber()};
});

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
    if (contract) {
      contract.on("NewVote", getOptions);
      getOptions();
    }

    return () => {
      if (contract) {
        contract.off("NewVote", getOptions);
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

  return {contract, vote}
}