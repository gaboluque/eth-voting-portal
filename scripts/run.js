const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const voteContractFactory = await hre.ethers.getContractFactory("VotePortal");
  const voteContract = await voteContractFactory.deploy(["Option1", "Option2"]);
  await voteContract.deployed();

  console.log("Contract deployed to:", voteContract.address);
  console.log("Contract deployed by:", owner.address);

  let voteCount;
  voteCount = await voteContract.getTotalVotes();

  let voteTxn = await voteContract.vote("Option1");
  await voteTxn.wait();

  voteCount = await voteContract.getTotalVotes();

  try {
    voteTxn = await voteContract.connect(randomPerson).vote("asdf");
    await voteTxn.wait();
  } catch (e) {
    console.log(e.message);
  }

  const option1Votes = await voteContract.getTotalVotesForOption("Option1");
  console.log("Votes for Option1: ", option1Votes);

  const option2Votes = await voteContract.getTotalVotesForOption("Option2");
  console.log("Votes for Option2: ", option2Votes);
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