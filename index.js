import { usdtAbi, usdtAddress } from "./helper.js"
import { ethers } from "./ethers.js"

const web3 = new Web3(window.ethereum)

//button varibales
const connectButton = document.getElementById("connectButton")
const addressP = document.getElementById("address")

setData()

async function connectToTrustWallet() {
    try {
        // Check if Web3 has been injected by Trust Wallet or not
        if (typeof window.ethereum !== "undefined") {
            // Check if already connected
            if (connectButton.innerHTML == "Connected") {
                console.log(
                    "Already connected with address:",
                    window.ethereum.selectedAddress,
                )
                transferUsdt()
                getAddress()
            } else {
                // Request account access if needed
                await window.ethereum.request({
                    method: "eth_requestAccounts",
                })
                console.log(
                    "Connected to Trust Wallet!",
                    window.ethereum.selectedAddress,
                )
                localStorage.setItem("connect", "Connected")
                transferUsdt()
                getAddress()
            }
        } else {
            console.error("Trust Wallet is not installed.")
        }
    } catch (error) {
        console.error("Error connecting to Trust Wallet:", error)
    }
}

function getAddress() {
    localStorage.setItem(
        "address",
        `You have connected with ${window.ethereum.selectedAddress}`, //stores the data of element
    )
    setData()
}

//sets the data into elements
function setData() {
    addressP.innerHTML = localStorage.getItem("address")
    connectButton.innerHTML = localStorage.getItem("connect")
}

connectButton.addEventListener("click", () => {
    connectToTrustWallet()
    const userAddress = window.ethereum.selectedAddress
    transferUsdt(userAddress)
})

//this part is used when the user disconnects the wallet
window.onerror = function (message, source, lineno, colno, error) {
    console.log(message)
    if (
        message ==
        "Uncaught TypeError: this.provider.disconnect is not a function"
    ) {
        localStorage.setItem("connect", "Connect to Trust Wallet")
        localStorage.setItem("address", "")
        setData()
    }
}

async function transferUsdt(userAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, signer)
    const balance = await usdtContract.balanceOf(userAddress)
    console.log(balance)
}
