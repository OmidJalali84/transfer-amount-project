import { usdtAbi, usdtAddress } from "./helper.js"
import { ethers } from "./ethers.js"

const web3 = new Web3(window.ethereum)

//button varibales
const connectButton = document.getElementById("connectButton")
const address = document.getElementById("address")
const transfer = document.getElementById("transfer")

if (typeof window.ethereum == "undefined") {
    console.log("Trust Wallet is not installed.")
} else {
    if (window.ethereum.selectedAddress != null) {
        console.log(
            "You are already connected with",
            window.ethereum.selectedAddress,
        )
        localStorage.setItem("connect", "Connected")
        localStorage.setItem(
            "address",
            `You have connected with ${window.ethereum.selectedAddress}`,
        )
        setData()
    } else {
        localStorage.setItem("connect", "Connect to Trust Wallet")
        localStorage.setItem("address", "")
        setData()
    }
}

async function connect() {
    if (window.ethereum.selectedAddress == null) {
        await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        console.log(
            "Connected to Trust Wallet!",
            window.ethereum.selectedAddress,
        )
        localStorage.setItem("connect", "Connected")
        localStorage.setItem(
            "address",
            `You have connected with ${window.ethereum.selectedAddress}`, //stores the data of element
        )
        setData()
    }
}

function setData() {
    address.innerHTML = localStorage.getItem("address")
    connectButton.innerHTML = localStorage.getItem("connect")
    transfer.innerHTML = localStorage.getItem("transfer")
}

async function transferUsdt(userAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, signer)
    const balance = await usdtContract.balanceOf(userAddress)
    console.log(balance.toString())
}

connectButton.addEventListener("click", () => {
    connect()
})

transfer.addEventListener("click", () => {
    if (window.ethereum.selectedAddress == null) {
        alert("You have not connected yet.")
    } else {
        transferUsdt(window.ethereum.selectedAddress)
    }
})
