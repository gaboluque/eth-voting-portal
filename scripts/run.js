const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const voteContractFactory = await hre.ethers.getContractFactory("VotePortal");
  const voteContract = await voteContractFactory.deploy(["Option1", "Option2"]);
  await voteContract.deployed();

  console.log("Contract deployed to:", voteContract.address);
  console.log("Contract deployed by:", owner.address);

  let voteTxn = await voteContract.vote(1);
  await voteTxn.wait();

  try {
    voteTxn = await voteContract.connect(randomPerson).vote(0);
    await voteTxn.wait();
  } catch (e) {
    console.log(e.message);
  }

  const votes = await voteContract.getVotes();
  votes.forEach(({option, count}) => {
    console.log(option, count);
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