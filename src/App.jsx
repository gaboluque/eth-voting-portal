import * as React from "react";
import './App.css';
import {useEffect, useState} from "react";
import {checkIfWalletIsConnected, connectToWallet} from "./eth/helpers";
import {useVoteContract} from "./hooks/useVoteContract";

const formatOptions = (options) => {
  console.log(options);
  return options.map(({count, option}) => ({option, count: count.toNumber()}));
}

export default function App() {
  const {contractReady, contract} = useVoteContract();
  const [options, setOptions] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    const address = await connectToWallet();
    setCurrentAccount(address);
  }

  const getOptions = async () => {
    if (contractReady) {
      try {
        let options = await contract.getVotes();
        return setOptions(formatOptions(options));
      } catch (error) {
        console.log(error);
        return [];
      }
    }
    return [];
  }

  useEffect(() => {
    checkIfWalletIsConnected().then((account) => {
      setCurrentAccount(account)
    });
  }, []);

  useEffect(() => {
    getOptions();
  }, [contractReady]);

  const vote = async (optionIndex) => {
    if (contractReady) {
      try {
        setLoading(true);
        const tx = await contract.vote(optionIndex);
        await tx.wait();
        await getOptions();
      } catch (error) {
        console.log(error);
      }
      finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>
        <div className="bio">
          Vote fot the option you like!
        </div>
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        <div className="options-container">
          {options.map(({option, count}, index) => (
            <div key={option} className="option-item">
              <p className="title">{option}</p>
              <p className="count">{`Votes: ${count}`}</p>
              <button disabled={loading} onClick={() => vote(index)}>{loading ? "Voting..." : "Vote"}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}