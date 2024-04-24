const hre = require("hardhat");

async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`
    );
  }
}

async function main() {
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  const BuyMeCoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeCoffee = await BuyMeCoffee.deploy();
  console.log("BuyMeCoffee deployed to ", await buyMeCoffee.getAddress());

  const addresses = [
    owner.address,
    tipper.address,
    await buyMeCoffee.getAddress(),
  ];
  console.log("== start == ");
  await printBalances(addresses);

  const tip = { value: hre.ethers.parseEther("1") };
  await buyMeCoffee.connect(tipper).buyCoffee("Ali", "you best ", tip);
  await buyMeCoffee.connect(tipper2).buyCoffee("Mamad", "!!!", tip);
  await buyMeCoffee.connect(tipper3).buyCoffee("Reza", "???", tip);

  console.log("=== after tip ===");
  await printBalances(addresses);

  await buyMeCoffee.connect(owner).withdrawTips();

  console.log("=== after withdraw tip ===");
  await printBalances(addresses);

  console.log("=== memos ===");
  const memos = await buyMeCoffee.getMemos();
  printMemos(memos);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(0);
  });
