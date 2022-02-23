const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const voteContractFactory = await hre.ethers.getContractFactory("VotePortal");
  const voteContract = await voteContractFactory.deploy(
    [["Option 1", "Description Option 1"], ["Option 2", "Description Option 2"]],
    {value: hre.ethers.utils.parseEther("100")});
  await voteContract.deployed();

  console.log("Contract deployed to:", voteContract.address);
  console.log("Contract deployed by:", owner.address);

  // Get Contract balance
  let contractBalance = await hre.ethers.provider.getBalance(voteContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));


  // Vote
  try {
    let voterBalance = await hre.ethers.provider.getBalance(randomPerson.address);
    console.log("Voter's balance before: ", hre.ethers.utils.formatEther(voterBalance));
    const voteTxn = await voteContract.connect(randomPerson).vote(0);
    await voteTxn.wait();
    voterBalance = await hre.ethers.provider.getBalance(randomPerson.address);
    console.log("Voter's balance after: ", hre.ethers.utils.formatEther(voterBalance));
  } catch (e) {
    console.log(e.message);
  }

  // Get Contract balance to see what happened!
  contractBalance = await hre.ethers.provider.getBalance(voteContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

  // Get votes
  console.log("VOTES: ");
  const votes = await voteContract.getVotes();
  votes.forEach(({name, description, count}) => {
    console.log(name, description, count.toNumber());
  })
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();