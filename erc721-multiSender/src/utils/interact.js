import { pinJSONToIPFS } from './pinata.js'
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const default_contract_abi = require('../contract-abi.json')
const default_contractAddress = "0x6a7115bb32120C67120AD9B62869de859b9fA657"; // 第3次

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: 'eth_requestAccounts'
            })
            const obj = {
                status: ' connected good.',
                address: addressArray[0],
            }
            return obj
        } catch (err) {
            return {
                address: '',
                status: 'wrong' + err.message,
            }
        }
    } else {
        return {
            address: '',
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            )
        }
    }
}

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Good...e.",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                  </a>
                    </p>
                </span>
            ),
        };
    }
}

export const mintNFT = async ({url, name, description, contractAddress = default_contractAddress, contractABI = default_contract_abi}) => {
    if (url.trim() == "" || (name.trim() == "" || description.trim() == "")) {
        return {
            success: false,
            status: "❗Please make sure all fields are completed before minting.",
        }
    }

    // make metadata
    const metadata = new Object()
    metadata.name = name
    metadata.image = url
    metadata.description = description

    // make pinata call
    const data = await pinJSONToIPFS(metadata)
    if (!data.success) {
        return {
            success: false,
            status: 'sth went wrong while uploading your token-uri'
        }
    }

    const tokenURI = data.pinataUrl
    // load smart contract
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();

    // setup transaction
    const transactionParameters = {
        to: contractAddress,
        from: window.ethereum.selectedAddress,
        'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI()
    }

    // sign the transaction via metamask
    try {
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters]
        })
        return {
            success: true,
            status: 'check out yhour transaction on ethersacn ropsten. '
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong in transaction: " + error.message
        }
    }

}

export const transNFT = async ({ recipient, tokenId, contractAddress = default_contractAddress,  contractABI = default_contract_abi }) => {
    //loadContract();
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    
    // setup transaction
    const transactionParameters = {
        to: contractAddress,
        from: window.ethereum.selectedAddress,
        'data': window.contract.methods.transNFT(recipient, tokenId).encodeABI()
    }

    // sign the transaction via metamask
    try {
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters]
        })
        return {
            success: true,
            status: 'transNFT ok, check out yhour transaction on ethersacn ropsten. '
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong in transNFT transaction: " + error.message
        }
    }
}

export const multiSender = async ({airdrops, contractAddress = default_contractAddress,  contractABI = default_contract_abi }) => {
    console.log('multiSender: ', airdrops, contractAddress, contractABI)
    //loadContract();
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    
    // setup transaction
    const transactionParameters = {
        to: contractAddress,
        from: window.ethereum.selectedAddress,
        'data': window.contract.methods.multiSender(airdrops).encodeABI()
    }

    // sign the transaction via metamask
    try {
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters]
        })
        return {
            success: true,
            status: 'multisender ok, check out transaction on ethersacn ropsten. '
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong in multisender transaction: " + error.message
        }
    }
}

export const multiSender_1151 = async ({airdrops, contractAddress = default_contractAddress,  contractABI = default_contract_abi }) => {
    
    //loadContract();
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    
    // setup transaction
    const transactionParameters = {
        to: contractAddress,
        from: window.ethereum.selectedAddress,
        'data': window.contract.methods.multiSender(airdrops).encodeABI()
    }

    // sign the transaction via metamask
    try {
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters]
        })
        return {
            success: true,
            status: 'multisender ok, check out transaction on ethersacn ropsten. '
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong in multisender transaction: " + error.message
        }
    }
}