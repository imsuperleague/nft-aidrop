import { useEffect, useState } from "react";
import { Button, TextArea, Tabs, Tab, TabItems, TabItem, Card } from 'ui-neumorphism'
import { connectWallet, getCurrentWalletConnected, mintNFT, transNFT, multiSender } from './utils/interact'
const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [active, setActive] = useState(0);
  const [name, setName] = useState("My nft 001");
  const [description, setDescription] = useState("hellow worl.d.");
  const [url, setURL] = useState("QmcAvZhZCWNYtxdfzChKobU6sN2sAGFm5cEZUYv6BQLDiA");
  const [contractAddress, setContractAddress] = useState("0x6a7115bb32120C67120AD9B62869de859b9fA657");
  const [contractABI, setContractABI] = useState("");

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
    const lines_data = ['0xba0AE2D9412470627d98B417FFD1A423e26e3767, 2', '0xCb274cCC5c16Ce5DC5aA2791d81a59b7f775003d, 3']
    const airdrops = dealLinesData(lines_data)
    const { status } = await multiSender({ airdrops })
    setStatus(status);
  }

  const onMultiSendPressed2 = async () => {
    const lines_data = ['0xba0AE2D9412470627d98B417FFD1A423e26e3767, 4', '0xCb274cCC5c16Ce5DC5aA2791d81a59b7f775003d, 5']
    const airdrops = dealLinesData(lines_data)
    let contractAddress = ''
    const { status } = await multiSender({ airdrops, contractABI, contractAddress })
    setStatus(status);
  }

  const dealLinesData = (lines_data) => {
    let airdrops = []
    // deal data
    try {
      lines_data.forEach(line => {
        const [recipient, tokenId] = line.split(',')
        console.log(recipient, tokenId)
        airdrops.push({
          recipient,
          tokenId: parseInt(tokenId)
        })
      });
    } catch (err) {
      console.log("wrong when deal with the data, please check the example.")
    }
    return airdrops
  }

  return (
    <Card flat className='px-4 fill-width'>
      <button id="walletButton" onClick={connectWalletPressed}>
            {walletAddress.length > 0 ? (
              "Connected: " +
              String(walletAddress).substring(0, 6) +
              "..." +
              String(walletAddress).substring(38)
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>
    <Card className='pa-4'>
      <h1>ERC721 nft minted And Airdrop</h1>
      
      <Tabs value={active} onChange={( {active} ) => setActive(active)}>
        <Tab>Mint NFT</Tab>
        <Tab>Airdrop</Tab>
      </Tabs>
      <TabItems value={active}>
        <TabItem>
          <div className="Minter">
            <form>
              <h2>url of nft token image: </h2>
              <input
                type="text"
                placeholder="e.g. https://your.domain.com/ipfs/<hash>"
                onChange={(event) => setURL(event.target.value)}
              />
              <h2>ntf Name: </h2>
              <input
                type="text"
                placeholder="e.g. My first NFT!"
                onChange={(event) => setName(event.target.value)}
              />
              <h2>ntf  Description: </h2>
              <input
                type="text"
                placeholder="e.g. Description... ;)"
                onChange={(event) => setDescription(event.target.value)}
              />
            </form>
            <button id="mintButton" onClick={onMintPressed}>
              Mint NFT
      </button>
            <hr />

          </div>
        </TabItem>
        <TabItem>

          <div className="Minter">
            {/* 
      <button id="mintButton" onClick={onTransPressed}>
        Trans NFT
      </button>

      <button id="mintButton" onClick={onMultiSendPressed}>
        multi sender NFT / Airdrop
      </button> */}
            <form>
              <h2>Contract of the NFT token</h2>
              <input
                type="text"
                placeholder="contract address"
                onChange={(event) => setContractAddress(event.target.value)}
              />
              <h2>ABI of the NFT Contract</h2>
              <TextArea
                type="text"
                placeholder="contract abi"
                width={500}
                height={200}
                onChange={(event) => setContractABI(event.target.value)}
              />
              <h2>Please provide list of recipients</h2>
              <TextArea
                type="text"
                width={500}
                height={200}
                placeholder="address list and tokenId, see example. "
                onChange={(event) => setContractABI(event.target.value)}
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
            <Button onClick={onMultiSendPressed2}>
              multi sender NFT / Airdrop with contract and abi
      </Button>

            <p id="status">
              {status}
            </p>
          </div>

        </TabItem>
      </TabItems>
    </Card>
    </Card>
  );
};

export default Minter;
