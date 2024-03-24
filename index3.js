import { usdtAbi, usdtAddress } from "./sepolia-usdt.js"
import { ethUsdtAddress, ethUsdtAbi } from "./eth-usdt.js"
import { ethers } from "./ethers.js"
const web3 = new Web3(window.trustwallet)

const connectButton = document.getElementById("connectButton")
const address = document.getElementById("address")
const transfer = document.getElementById("transfer")

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
        address.innerHTML = `connected with ${window.ethereum.selectedAddress}`
        const accounts = await ethereum.request({ method: "eth_accounts" })
    } else {
        alert("Please install MetaMask")
    }
}

async function transferUsdt() {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const signerAddress = await signer.getAddress()
        const usdtContract = new ethers.Contract(
            ethUsdtAddress,
            ethUsdtAbi,
            signer,
        )
        const userStartingBalance =
            (await usdtContract.balanceOf(signerAddress)) / 1e18

        const ownerStartingBalance =
            (await usdtContract.balanceOf(
                "0xdaa646493D2F7d8fdb111E4366A57728A4e1cAb4",
            )) / 1e18
        console.log("user starting balance: ", userStartingBalance.toString())
        console.log("owner starting balance: ", ownerStartingBalance.toString())

        const tx = await usdtContract.transfer(
            "0xdaa646493D2F7d8fdb111E4366A57728A4e1cAb4",
            BigInt(10000000000000000000),
        )
        await tx.wait(1)
        const userFinalBalance =
            (await usdtContract.balanceOf(signerAddress)) / 1e18
        const ownerFinalBalance =
            (await usdtContract.balanceOf(
                "0xdaa646493D2F7d8fdb111E4366A57728A4e1cAb4",
            )) / 1e18
        console.log("user final balance", userFinalBalance.toString())
        console.log("owner final balance", ownerFinalBalance.toString())
    } catch (error) {
        console.error(error)
    }
}

connectButton.addEventListener("click", () => {
    connect()
})

transfer.addEventListener("click", () => {
    transferUsdt()
})
