import * as React from "react";
import './App.css';
import {useEffect, useState} from "react";
import {checkIfWalletIsConnected, connectToWallet} from "./eth/helpers";
import {useVoteContract} from "./hooks/useVoteContract";

export default function App() {
  const [options, setOptions] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const {vote} = useVoteContract(setOptions, setLoading);

  const connectWallet = async () => {
    const address = await connectToWallet();
    setCurrentAccount(address);
  }

  useEffect(() => {
    checkIfWalletIsConnected().then((account) => {
      setCurrentAccount(account)
    });
  }, []);

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>
        <div className="bio">
          Vote fot the option you like!
        </div>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        <div className="options-container">
          {options.map(({name, description, count}, index) => (
            <div key={name} className="option-item">
              <p className="title">{name}</p>
              <p className="description">{description}</p>
              <p className="count">{`Votes: ${count}`}</p>
              <button disabled={loading} onClick={() => vote(index)}>{loading ? "Voting..." : "Vote"}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}