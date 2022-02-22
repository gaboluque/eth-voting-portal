import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import {useEffect, useState} from "react";

const testOptions = [{
  option: "Option1",
  count: 1
}, {
  option: "Option2",
  count: 2
}, {
  option: "Option3",
  count: 3
}]

export default function App() {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(testOptions);
  }, [])

  const vote = (optionIndex) => {
    console.log(optionIndex);
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
        <div className="options-container">
          {options.map(({option, count}, index) => (
            <div key={option} className="option-item">
              <p className="title">{option}</p>
              <p className="count">{`Votes: ${count}`}</p>
              <button onClick={() => vote(index)}>Vote</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}