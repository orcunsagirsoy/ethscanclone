import axios from "axios";

const { ethers } = require("ethers") // for nodejs only
const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_sepolia")
const aggregatorV3InterfaceABI = [
    {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "description",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
        name: "getRoundData",
        outputs: [
            { internalType: "uint80", name: "roundId", type: "uint80" },
            { internalType: "int256", name: "answer", type: "int256" },
            { internalType: "uint256", name: "startedAt", type: "uint256" },
            { internalType: "uint256", name: "updatedAt", type: "uint256" },
            { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "latestRoundData",
        outputs: [
            { internalType: "uint80", name: "roundId", type: "uint80" },
            { internalType: "int256", name: "answer", type: "int256" },
            { internalType: "uint256", name: "startedAt", type: "uint256" },
            { internalType: "uint256", name: "updatedAt", type: "uint256" },
            { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "version",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
]





export default function getEthPrice() {
    let price;

    const addr = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43"
    const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider);

    priceFeed.latestRoundData().then((roundData: any) => {
        // Do something with roundData
        console.log("roundData", parseInt(roundData.answer))
        price = roundData;
    })
    return price;
}

export const getCoinData = async (coinID = '', currentPage = 1, perPage = 20) => {
    /* 
        try {
    */
    const result = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: perPage,
            page: currentPage,
            sparkline: true,
            ids: coinID /* 'bitcoin,ethereum,okb','tether' */
        },
        /*
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        }
        */
    }
    );
    return result.data;
    /*
    } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data);
    }
    */
};