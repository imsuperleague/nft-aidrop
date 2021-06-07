import { useEffect, useState } from "react";
import { Fab, TextField, Button, TextArea, Tabs, Tab, TabItems, TabItem, Card } from 'ui-neumorphism'
import { connectWallet, getCurrentWalletConnected, mintNFT, transNFT, multiSender, multiSender_1151 } from './utils/interact'
const default_contract_abi = require('./contract-abi.json')
const default_contract_abi_1151 = require('./contract-abi_1151.json')

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [active, setActive] = useState(0);
  const [name, setName] = useState("My nft 001");
  const [description, setDescription] = useState("hellow worl.d.");
  const [url, setURL] = useState("QmcAvZhZCWNYtxdfzChKobU6sN2sAGFm5cEZUYv6BQLDiA");
  const [contractAddress, setContractAddress] = useState("0x6a7115bb32120C67120AD9B62869de859b9fA657");
  const [contractABI, setContractABI] = useState(JSON.stringify(default_contract_abi));
  const [airdropLines, setAirdropLines] = useState("0xba0AE2D9412470627d98B417FFD1A423e26e3767, 2 \n0xCb274cCC5c16Ce5DC5aA2791d81a59b7f775003d, 3");


  const [contractAddress_1151, setContractAddress_1151] = useState("0x1f045aafe36444529beef4e37fd662451ed2c6fd");
  const [contractABI_1151, setContractABI_1151] = useState(JSON.stringify(default_contract_abi_1151));
  const [airdropLines_1151, setAirdropLines_1151] = useState("0xba0AE2D9412470627d98B417FFD1A423e26e3767, 1, 2\n0xCb274cCC5c16Ce5DC5aA2791d81a59b7f775003d,2,3");

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽change to." + accounts[0]);
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" rel="noopener" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  useEffect(async () => { //TODO: implement
    const { address, status } = await getCurrentWalletConnected()
    setWallet(address)
    setStatus(status)
    addWalletListener();

  }, []);

  const connectWalletPressed = async () => { //TODO: implement
    const walletResponse = await connectWallet()
    setStatus(walletResponse.status)
    setWallet(walletResponse.address)
  };

  const onMintPressed = async () => { //TODO: implement
    const { status } = await mintNFT({ url, name, description })
    setStatus(status);
  };

  const onTransPressed = async () => {
    const recipient = '0xba0AE2D9412470627d98B417FFD1A423e26e3767'  // #2 wallet
    const tokenId = 2
    const { status } = await transNFT({ recipient, tokenId })
    setStatus(status);
  }

  const onMultiSendPressed = async () => {
    // const lines_data = ['0xba0AE2D9412470627d98B417FFD1A423e26e3767, 2', '0xCb274cCC5c16Ce5DC5aA2791d81a59b7f775003d, 3']
    const airdrops = dealLinesData(airdropLines.split('\n'))
    console.log('airdrops: ', airdrops)
    const { status } = await multiSender({ airdrops, contractAddress, contractABI: JSON.parse(contractABI) })
    setStatus(status);
  }

  const onMultiSendPressed_1151 = async () => {
    const airdrops = dealLinesData_1151(airdropLines_1151.split('\n'))
    const { status } = await multiSender_1151({ airdrops, contractAddress: contractAddress_1151, contractABI: JSON.parse(contractABI_1151) })
    setStatus(status);
  }

  const dealLinesData = (lines_data) => {
    let airdrops = []
    // deal data
    try {
      lines_data.forEach(line => {
        const [recipient, tokenId] = line.split(',')
        airdrops.push({
          recipient: recipient.trim(),
          tokenId: parseInt(tokenId)
        })
      });
    } catch (err) {
      console.log("wrong when deal with the data, please check the example.")
    }
    return airdrops
  }

  const dealLinesData_1151 = (lines_data) => {
    let airdrops = []
    try {
      lines_data.forEach(line => {
        const [recipient, tokenId, amount] = line.split(',')
        airdrops.push({
          to: recipient.trim(),
          id: parseInt(tokenId),
          amount: parseInt(amount),
        })
      });
    } catch (err) {
      console.log("wrong when deal with the data, please check the example.")
    }
    return airdrops
  }

  const ConnetWalletFab = (
    <Fab color='#299ae6' onClick={connectWalletPressed}>
      {walletAddress.length > 0 ? (
        "🦊Connected: " +
        String(walletAddress).substring(0, 6) +
        "..." +
        String(walletAddress).substring(38)
      ) : (
        <span>Connect Wallet</span>
      )}
    </Fab>
  )

  const MintTabItem = (
    <TabItem>
      <h2>ERC721</h2>
      <form>
        <p>url of nft token image: </p>
        <TextField
          type="text"
          width={500}
          placeholder="e.g. https://your.domain.com/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <p>ntf Name: </p>
        <TextField
          type="text"
          width={500}
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <p>ntf  Description: </p>
        <TextField
          type="text"
          width={500}
          placeholder="e.g. Description... ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <Button color="blue" onClick={onMintPressed}>
        Mint NFT
            </Button>
    </TabItem>
  )

  const collTabItem = (
    <TabItem>
      none.
    </TabItem>
  )

  const airdropTabItem = (
    <TabItem>
      <form>
        <p>Contract of the NFT token</p>
        <TextField
          type="text"
          width={800}
          placeholder="contract address"
          value={contractAddress} onChange={({ value }) => setContractAddress(value)}
        />
        <p>ABI of the NFT Contract</p>
        <TextArea
          type="text"
          placeholder="contract abi"
          width={800}
          height={200}
          value={contractABI} onChange={({ value }) => setContractABI(value)}
        />
        <p>Please provide list of recipients</p>
        <TextArea
          type="text"
          width={800}
          height={200}
          placeholder="address list and tokenId, see example. "
          value={airdropLines} onChange={({ value }) => setAirdropLines(value)}
        />
        <p>example:</p>
        <div className="example-div">
          <p> for ERC721(address, id) </p>
          <p>
            0x63Ed7e96CaA84CE8521874d7eE1Ed3bfEA38B316,60
            0x7B32C3158b7f193D3Ea33f5488175C499D492ca2,61
          </p>
        </div>
      </form>
      <br />
      <Button outlined block color="blue" onClick={onMultiSendPressed}>
        multi sender Airdrop
      </Button>
      <br />

      <p id="status">
        {status}
      </p>
    </TabItem>
  )

  const airdropTabItem1155 = (
    <TabItem>
      <h2>ERC 1155</h2>
      <form>
        <p>Contract of the NFT token</p>
        <TextField
          type="text"
          width={800}
          placeholder="contract address"
          value={contractAddress_1151} onChange={({ value }) => setContractAddress_1151(value)}
        />
        <p>ABI of the NFT Contract</p>
        <TextArea
          type="text"
          placeholder="contract abi"
          width={800}
          height={200}
          value={contractABI_1151} onChange={({ value }) => setContractABI_1151(value)}
        />
        <p>Please provide list of recipients</p>
        <TextArea
          type="text"
          width={800}
          height={200}
          placeholder="address list and tokenId, see example. "
          value={airdropLines_1151} onChange={({ value }) => setAirdropLines_1151(value)}
        />
        <p>example:</p>
        <div className="example-div">
          <p> for ERC721(address, id, amount) </p>
          <p>
          0xb50cA0C79F9dF405B708b3E517fC99FC12B7AdFB,1,100
          0x57eC2aEFB7bA9237E6a83B03Bb7CecD5C494AcA1,2,95
          </p>
        </div>
      </form>
      <br />
      <Button outlined block color="blue" onClick={onMultiSendPressed_1151}>
        multi sender Airdrop 1151
      </Button>
      <br />

      <p id="status">
        {status}
      </p>
    </TabItem>
  )
  return (
    <div className="main-container">
      <Card flat className='px-4 fill-width'>
        {ConnetWalletFab}
        <div className="title">
          <h1>NFT multiSender Airdrop</h1>
        </div>
        <Card className='pa-4'>
          <Tabs value={active} onChange={({ active }) => setActive(active)}>
            <Tab>721</Tab>
            <Tab>1151</Tab>
          </Tabs>
          <TabItems value={active} className="tab-items" height={1000}>
            {airdropTabItem}
            {airdropTabItem1155}
          </TabItems>
          </Card>
      </Card>
    </div>
  );
};

export default Minter;
