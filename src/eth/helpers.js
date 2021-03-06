export const connectToWallet = async () => {
  try {
    const {ethereum} = window;

    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }

    const accounts = await ethereum.request({method: "eth_requestAccounts"});

    console.log("Connected", accounts[0]);
    return accounts[0];
  } catch (error) {
    console.log(error)
  }
}

export const checkIfWalletIsConnected = async (callback) => {
  try {
    const {ethereum} = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    /*
    * Check if we're authorized to access the user's wallet
    */
    const accounts = await ethereum.request({method: "eth_accounts"});

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.log("No authorized account found")
    }
  } catch (error) {
    console.log(error);
  }
}