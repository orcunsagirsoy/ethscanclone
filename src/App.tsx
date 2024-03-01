import { Alchemy, Block, BlockTag, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import './App.css';
import React from 'react';
import axios from 'axios';
import { getCoinData } from './helpers/ethPriceGetter';
import { ethers, utils } from 'ethers';
import { PiCubeThin, PiNotebookThin } from "react-icons/pi";
import { CgNotes } from "react-icons/cg";
// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

declare global {
  interface Window {
    ethereum?: any
  }
}
// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);
//const provider = new ethers.BrowserProvider(window.ethereum!);

const env = "https://eth-mainnet.g.alchemy.com/v2/E4ZdeAXRLiyRfK2OivfijeAiN0RwEEb2"
const provider = new ethers.providers.JsonRpcProvider(env)


function App() {
  const [currentBlock, setCurrentBlock] = useState<number>();
  const [blockTransactions, setBlockTransactions] = useState<readonly string[]>();
  const [ethPriceUSD, setEthPriceUSD] = useState<number>();
  const [ethPriceBTC, setEthPriceBTC] = useState<number>();
  const [marketCap, setMarketCap] = useState<string>();
  const [totalTnxCount, setTotalTnxCount] = useState<string>(parseInt('2274').toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  const [gasPrice, setGasPrice] = useState<string>();
  const [blockDetail, setBlockDetail] = useState<Block>();
  const [secondsAgo, setSecondsAgo] = useState<number>();
  const [lastSixBlockDetail, setLastSixBlockDetail] = useState<Block[]>();
  const [lastTransactions, setLastTransactions] = useState<string[]>();

  /* React.useEffect(() => {
    axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR&api_key=4b9fd884fbc899c0ab4115a61ae83d620ab39fe728fad4dd842d27c49abeec0f').then((response) => {
      //console.log("response: ", response.data);
      setEthPriceUSD(response.data.USD);
      setEthPriceBTC(response.data.BTC);
    });
  }, []); */

  useEffect(() => {
    async function fetchCoinData() {
      /* const reponse = await getCoinData();
      console.log("reponse", reponse);
      setMarketCap(reponse[1]['market_cap'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) */
    }

    fetchCoinData();
  }, []);


  useEffect(() => {
    async function fetchCurrentBlock() {
      setCurrentBlock(await alchemy.core.getBlockNumber());
      //console.log(currentBlock);
    }

    fetchCurrentBlock();
  }, []);

  function getSecondsAgo(timestamp: number) {
    const now = Date.now();

    const seconds = parseInt((now / 1000).toFixed(0));
    const secondsAgo = seconds - timestamp;
    return secondsAgo;
  }
  function getTnxCount(transactions: string[]) {

    return transactions.length;
  }

  useEffect(() => {
    async function getLastSixBlockDetail() {
      if (currentBlock) {
        const lastSixBlocks = await fetchLastSixBlockDetail();
        setLastSixBlockDetail(lastSixBlocks);
        setLastTransactions(lastSixBlocks![0].transactions.slice(0, 6));
        //console.log(blockDetail.timestamp);
      }
    }

    getLastSixBlockDetail();
  }, [currentBlock]);


  async function fetchLastSixBlockDetail(): Promise<Block[] | undefined> {
    const lastSixBlockDetail = [];
    for (let i = 0; i < 6; i++) {
      lastSixBlockDetail.push(await provider.getBlock(currentBlock! - i));
    }
    console.log(lastSixBlockDetail);
    return lastSixBlockDetail;
  }


  useEffect(() => {
    async function getTransactions() {
      /* const block = await provider.getBlock(currentBlock as BlockTag);
      console.log("block", block);
      setBlockTransactions(block?.transactions); */

    }
    getTransactions();
  }, []);

  useEffect(() => {
    async function fetchGasPrice() {
      /* const gasPrice = await provider.getGasPrice();
      const gweiGasPrice = utils.formatUnits(gasPrice, "gwei");
      console.log("gasPrice", gweiGasPrice);
      setGasPrice(parseInt(gweiGasPrice).toFixed(0)); */

    }
    fetchGasPrice();
  }, []);



  return (
    <>
      <div className='container'>
        <div className='sub-container'>

          <div className='eth-container'>

            <div className="eth-subcontainer-1">

              <div className="eth-subcontainer-1a">
                <div>ETH PRICE</div>
                <div>${ethPriceUSD} @ {ethPriceBTC} BTC</div>
              </div>

              <div className="eth-subcontainer-1b">
                <div>MARKET CAP</div>
                <div>${marketCap}</div>
              </div>
            </div>

            <div className='border-line'></div>

            <div className="eth-subcontainer-2">
              <div className="eth-subcontainer-2a">
                <div>TRANSACTIONS</div>
                <div>{totalTnxCount} M</div>


              </div>
              <div className="eth-subcontainer-2b">
                <div>GAS PRICE</div>
                <div>{gasPrice} Gwei</div></div>
            </div>

            <div className='border-line'></div>

            <div className="eth-subcontainer-3">CHART GOES HERE</div>

          </div>

          <div className='blk-trnx-container'>

            <div className="latest-blocks">
              <h4 className='card-header-title'>
                Latest Blocks
              </h4>
              <div className='border-line-header'></div>
              <section className='blocks'>

                {
                  lastSixBlockDetail?.map(block => (
                    <>
                      <div className='single-block'>
                        <div className='single-block-info'>
                          <div className='block-logo-container'>
                            <div>
                              <PiCubeThin size={24} />
                            </div>
                          </div>
                          <div>
                            <div className='current-block'>
                              {block.number}
                            </div>
                            <div className='seconds-ago'>
                              {getSecondsAgo(block.timestamp)} secs ago
                            </div>
                          </div>
                        </div>

                        <div className='single-block-tnx'>
                          <div className='single-block-tnx-miner'>
                            <span style={{ color: 'black' }}>Miner&nbsp;</span> {` ${block.miner}`}
                          </div>

                          <div className='single-block-tnx-count'>
                            {getTnxCount(block.transactions)} txns
                          </div>

                        </div>

                        <div className='single-block-reward'>
                          <span style={{ color: 'black' }}>Gas used&nbsp;</span>  {utils.formatUnits(parseInt(block.gasUsed.toString()), "gwei")} <span className='seconds-ago'>&nbsp;(gwei)</span>
                        </div>
                      </div>
                      <div className='border-line-header'></div>
                    </>


                  ))
                }





              </section>

            </div>

            <div className="latest-transactions">
              <h4 className='card-header-title'>
                Latest Transactions
              </h4>
              <div className='border-line-header'></div>
              <section className='transactions'>

                {
                  lastTransactions?.map(tnx => (
                    <>
                      <div className='single-block'>
                        <div className='single-block-info'>
                          <div className='block-logo-container'>
                            <div>
                              <PiNotebookThin size={24} />
                            </div>
                          </div>
                          <div>
                            <div className='current-block'>
                              {`${tnx.substring(0, 8)}...`}

                            </div>
                            <div className='seconds-ago'>
                            </div>
                          </div>
                        </div>

                        <div className='single-block-tnx'>
                          <span>From</span>
                          <span>To</span>


                        </div>

                        <div className='single-block-reward'>
                        </div>
                      </div>
                      <div className='border-line-header'></div>
                    </>


                  ))
                }

              </section>
            </div>

          </div>

        </div>


      </div>
    </>

  );
}

export default App;
