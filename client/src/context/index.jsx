import React, {createContext, useContext, useEffect, useState} from "react";
import {ethers} from "ethers";
import abi from "./Contract.json";
import erc20Abi from "./Erc20.json";
import Web3 from 'web3';
import {calculateAmountWithDecimals} from "../utils";
import { Icon } from '@iconify/react';
const CONTRACT_ADDRESS = "0xA7a4D6C52280840757C548c0cF25fEc195FdF475";
const RAISE_TOKEN_ADDRESS = "0x024Db6caB962315Db451b3a8aa6Fe7b8020666f1";
const StateContext = createContext();
import detectEthereumProvider from '@metamask/detect-provider'
import axios from 'axios';
export const StateContextProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [address, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const initialState = { accounts: [],  chainId: "" }  /* Updated */
  const [wallet, setWallet] = useState(initialState)
  const [hasProvider, setHasProvider] = useState(null)
    // const connect = async () => {
    //   if (window.ethereum) {
    //     try {
    //       await window.ethereum.request({ method: 'eth_requestAccounts' });
    //       const web3Instance = new Web3(window.ethereum);
    //       const accounts = await web3Instance.eth.getAccounts();
    //       setWeb3(web3Instance);
    //       setAccount(accounts[0]);
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   }
    // };

    useEffect(() => {
      const refreshAccounts = (accounts) => {
        if (accounts.length > 0) {
          updateWallet(accounts)
        } else {
          // if length 0, user is disconnected
          setWallet(initialState)
        }
      }
  
      const refreshChain = (chainId) => {               /* New */
        setWallet((wallet) => ({ ...wallet, chainId }))      /* New */
      }                                                      /* New */
  
      const getProvider = async () => {
                    console.log("aici")                           
          const accounts = await window.ethereum.request(
            { method: 'eth_accounts' }
          )
          refreshAccounts(accounts)
          const web3Instance = new Web3(window.ethereum);
         setWeb3(web3Instance);
         setAccount(accounts[0]);
          window.ethereum.on('accountsChanged', refreshAccounts)
          window.ethereum.on("chainChanged", refreshChain)  /* New */
        }
      
  
      getProvider()

      return () => {
        window.ethereum?.removeListener('accountsChanged', refreshAccounts)
        window.ethereum?.removeListener("chainChanged", refreshChain)  /* New */
      }
    }, [])
  
    const updateWallet = async (accounts) => {                                                           /* New */
      const chainId = await window.ethereum.request({                 /* New */ 
        method: "eth_chainId",                                         /* New */ 
      })                                                               /* New */ 
      setWallet({ accounts, chainId })                        /* Updated */ 
      setAccount(accounts[0])
    }
  
    const connect = async () => {
      //console.log("aicisadsa")
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      console.log(accounts)
      updateWallet(accounts)
    }
  


  useEffect(() => {
    const initializeContract = async () => {
      if (web3 && wallet) {
        try {
          const contractInstance = new web3.eth.Contract(
            abi,
            CONTRACT_ADDRESS,
          );
          setContract(contractInstance);
        } catch (err) {
          console.error(err);
        }

      }
    };

    initializeContract();
  }, [web3, wallet]);






  const checkUserAllowance = async (erc20Address,userAddress,amount) => {
    //init erc20 contract
    const erc20Contract = new web3.eth.Contract(
      erc20Abi,
      erc20Address,
    );

    try {
      const decimals = await erc20Contract.methods.decimals().call();
      const allowance = await erc20Contract.methods.allowance(userAddress,CONTRACT_ADDRESS).call();
      if (allowance < amount * (10**decimals)){
        return false;
      }else{
        return true;
      }
    }catch(error){
      console.log(error);
      return false;
    }
  }
  
  const setAllowance = async (erc20Address,userAddress,amount) => {
     //init erc20 contract
     const erc20Contract = new web3.eth.Contract(
      erc20Abi,
      erc20Address,
    );
    try {
      const decimals = await erc20Contract.methods.decimals().call();
      console.log("decimals == ",decimals);
      var amountScaled = ethers.utils.parseUnits(amount,decimals);
      const data = await erc20Contract.methods.approve(CONTRACT_ADDRESS,amountScaled).send({from: userAddress});
    }catch(error){
      console.log(error);
    }
  }

  
  const getDecimals = async (erc20Address) => {
     //init erc20 contract
     const erc20Contract = new web3.eth.Contract(
      erc20Abi,
      erc20Address,
    );
    return await erc20Contract.methods.decimals().call();
  }

  const getGasLimit = async () => {
    try {
      //console.log('Gas limit:', gasLimit);
      return await web3.eth.estimateGas({from: address});
    } catch (error) {
      console.log('Error getting gas limit:', error);
      return null;
    }
  }

  const getProjects = async () => {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    console.log(wallet)
    if (chainId == "0xaa36a7"){
      //init contract
      const fundContract = new web3.eth.Contract(
        abi,
        CONTRACT_ADDRESS,
      )

      let noOfProjects;
      console.log("step1 : get no of project")
      try {
        noOfProjects = await fundContract.methods.lastProjectId().call();
        console.log("noOfproject :" +noOfProjects)
      }catch (error) {
        console.log('Error getting no of projects:', error);
        return [null,""];
      }
      console.log("step2 : get projects")
      const projects = [];
      const decimals = await getDecimals(RAISE_TOKEN_ADDRESS);
      for (let i = 0 ; i < noOfProjects; i++){
        try {
          const project = await fundContract.methods.projects(i).call();
          //parse the project
          const equityTokenDecimals = await getDecimals(project.equityToken)
          const x = {
            pId: i,
            owner: project.creator,
            title: project.title,
            description: project.description,
            target: calculateAmountWithDecimals(project.targetRaiseAmount, decimals),
            startDate: parseInt(project.startTime),
            endDate: parseInt(project.endTime),
            amountCollected: calculateAmountWithDecimals(project.currentRaiseAmount, decimals),
            rewards: calculateAmountWithDecimals(project.equityAmount, equityTokenDecimals),
            equityToken: project.equityToken,
            funders : project.noOfFunders,
          };
          projects[i] = x;
        }catch(error){
          console.log("error getting projects")
          return [null,""]
        }
      }

      return [projects,""];
    }else{
      return [null,"You are on the wrong network, switch to sepolia network"]
    }
  }

  const getUserProjectFunds = async (projectId) => {
      var amountFund
      try {
        var decimals = await getDecimals(RAISE_TOKEN_ADDRESS);
        var funds = await contract.methods.contributions(projectId,address).call();
        amountFund = calculateAmountWithDecimals(funds,decimals)
        
      }catch(error) {
        console.log(error)
      }

      return amountFund;
  }

  const fundProject = async (projectId,amount) => {
    try {
      var ok = await checkUserAllowance(RAISE_TOKEN_ADDRESS,address,amount);
      console.log(ok);
      if(!ok){
          console.log("allowance too low");
          console.log("Step 1.1: set user allowance to amount value:", amount);
          var allowance = await setAllowance(RAISE_TOKEN_ADDRESS,address,amount);
          console.log(allowance);
      }
      console.log(projectId,amount)
      var decimals = await getDecimals(RAISE_TOKEN_ADDRESS);
      var amountWithDecimals = BigInt(amount * (10**decimals));
      var data = await contract.methods.contribute(projectId,amountWithDecimals).send({from: address});
      console.log(data)
    }catch(error){
      console.log(error)
    }
  }

  const withdrawFunds = async (projectId,amount) => {
    try {
      console.log(projectId,amount)
      var decimals = await getDecimals(RAISE_TOKEN_ADDRESS);
      var amountWithDecimals = BigInt(amount * (10**decimals));
      var data = await contract.methods.reduceContribution(projectId,amountWithDecimals).send({from: address});
      console.log(data)
    }catch(error){
      console.log(error)
    }
  }
  
  const claimReward = async (projectId) => {
    try {
      var data = await contract.methods.claimEquity(projectId).send({from: address});
      console.log(data)
    }catch(error){
      console.log(error)
    }
  }

  const checkUserClaimed = async (projectId) => {
    try{
      return await contract.methods.claimedEquity(projectId,address).call();
    }catch(error){
      console.log(error)
    }
  }

  const withdrawProjectFunds = async (projectId) => {
    try {
      var data = await contract.methods.withdrawFunds(projectId).send({from: address})
      return data;
    }catch(error){
      console.log(error)
    }
  }

  const withdrawRemainingRewards = async (projectId) => {
    try {
      var data = await contract.methods.withdrawRemainingEquity(projectId).send({from: address})
      return data;
    }catch(error){
      console.log(error)
    }
  }

  const transferERC20  = async (recipient,tokenAddress,amount) => {
    try{
       //init erc20 contract
     const erc20Contract = new web3.eth.Contract(
      erc20Abi,
      tokenAddress,
    );

      var decimals =  await erc20Contract.methods.decimals().call();
      var amountWithDecimals = BigInt(amount * (10**decimals));

      return await erc20Contract.methods.transfer(recipient,amountWithDecimals).send({from: address});
    }catch(error) {
      console.log(error);
    }
  }


      function createDataForBlocksTable(icon, number, NoOfTxs, ChainId,Value) {
        return { icon, number, NoOfTxs, ChainId, Value };
      }
      function createDataForTransactionsTable(icon, txHash, from, to,txIndex,value) {
        return { icon, txHash, from, to,txIndex, value };
    }


    const getBlocks = async (limit,offset) => {
        var link = "https://managemenet-txs.herokuapp.com/api/explorer/blocks?limit="+limit+"&offset="+offset 
        const response = await fetch(link);
        const data = await response.json();
        const blocksData = data.data;
        var blocks = [];
        for (var i = 0 ; i < blocksData.length;i++){
          //console.log(blocksData[i])
            var row = createDataForBlocksTable( 
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
                <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
                <Icon icon="clarity:block-line" />
                </span>
            </div>, 
            blocksData[i].blockNumber,
            blocksData[i].numberOfTxs,
            blocksData[i].chainId,
            0.
            )
        blocks[i] = row;
        }
        return blocks;
    }

    const getBlocksData = async (blockNumber,chainId) => {
      var link = "https://managemenet-txs.herokuapp.com/api/explorer/blocks/"+blockNumber +"?chainId="+ chainId;
      const response = await fetch(link);
      const data = await response.json();
      const blocksData = data.data;
      return blocksData
    }

    const getBlockTxs = async (blockNumber, chainId,limit,offset) => {
      var link = "https://managemenet-txs.herokuapp.com/api/explorer/blocks/"+blockNumber +"/transactions?chainId="+ chainId +"&limit="+limit+"&offset="+offset;
      const response = await fetch(link);
      const data = await response.json();
      const blocksData = data.data;
      var blocks = [];
        for (var i = 0 ; i < blocksData.length;i++){
          //console.log(blocksData[i])
            var row = createDataForTransactionsTable(
              <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
                <span class="mdi mdi:file-transfer-outline text-xl sm:text-2xl text-indigo-500">
                  <Icon icon="mdi:file-transfer-outline" />
                </span>
              </div>,
              blocksData[i].tx_hash,
              blocksData[i].from,
              blocksData[i].to,
              blocksData[i].tx_index,
              blocksData[i].value,
            )
        blocks[i] = row;
        }
        return blocks;
    }

    function createDataForLogsTable(icon, logIndex, topic0, data) {
      return { icon, logIndex, topic0 ,data };
    }

    const getTransactionByHash = async (txhash) => {
      var link = "https://managemenet-txs.herokuapp.com/api/explorer/tx/"+ txhash;
      const response = await fetch(link)
      const dataReponse = await response.json();
      var data = dataReponse.data
      var tx = {
        txHash: data.tx_hash,
        status: "Success",
        block: data.included_in_block,
        from : data.from,
        to : data.to,
        value : data.value,
        msgGasLimit : data.msg_gas_limit,
        gasUsed : data.tx_gas_used,
        gasPrice : data.tx_gas_price,
        noOfLogs : (data.logs && data.logs.logs === null) ? 0: data.logs.logs.length  ,
      }
      var logs = []
      if (data.logs && data.logs.logs ===null) {
        return [tx,logs];
      }
      for(var i=0;i< data.logs.logs.length; i++){
        const x = data.logs.logs[i]
        var log = createDataForLogsTable(
          <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
            <span class="mdi mdi:about-circle-outline text-xl sm:text-2xl text-indigo-500">
              <Icon icon="mdi:about-circle-outline" />
            </span>
          </div>,
          parseInt(x.logIndex),
          x.topics[0],
          x.data
        )

        logs[i] = log
      }
      return [tx,logs];
    } 

    
    const getUserTxs = async (limit,offset) => {
      var link = "https://managemenet-txs.herokuapp.com/api/explorer/users/"+address +"/txs?limit="+limit+"&offset="+offset;
      const response = await fetch(link);
      const data = await response.json();
      const blocksData = data.data;
      var blocks = [];
        for (var i = 0 ; i < blocksData.length;i++){
          //console.log(blocksData[i])
            var row = createDataForTransactionsTable(
              <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
                <span class="mdi mdi:file-transfer-outline text-xl sm:text-2xl text-indigo-500">
                  <Icon icon="mdi:file-transfer-outline" />
                </span>
              </div>,
              blocksData[i].tx_hash,
              blocksData[i].from,
              blocksData[i].to,
              blocksData[i].tx_index,
              blocksData[i].value,
            )
        blocks[i] = row;
        }
        return blocks;
    }

    const getUserOverview = async() => {
      var link = "https://managemenet-txs.herokuapp.com/api/explorer/users/"+address +"/overview";
      const response = await fetch(link);
      const data = await response.json();
      const blocksData = data.data;
      // Get the ETH balance of the first account
      const ethBalance = await web3.eth.getBalance(address);
      // Convert the balance from Wei to Ether
      const ethBalanceInEther = web3.utils.fromWei(ethBalance, "ether");
      return {
        ethBalance : ethBalanceInEther,
        txSent : blocksData.txSent == undefined ? 0 : blocksData.txSent,
        txReceived : blocksData.txReceived == undefined ? 0 : blocksData.txReceived ,
        totalTxs : blocksData.totalTxs == undefined ? 0 :  blocksData.totalTxs,
      }
    }
    
    const getDashboardOverview = async () => {
      var link = "https://managemenet-txs.herokuapp.com/api/explorer/overview";
      const response = await fetch(link);
      const data = await response.json();

      console.log(web3.eth)
      // Get the latest block number
      const blockNumber = await web3.eth.getBlockNumber();
      const responsePrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');

      // Extract the ETH price from the response data
      const price = responsePrice.data.ethereum.usd;

      const overview = data.data;
      return {
        highestBlockInDb : overview.highestBlockInDb,
        blocksIndexed : overview.blocksIndexed,
        latestBlock : blockNumber,
        transactions : overview.transactions_24H,
        blocks : overview.blocks_24h,
        ethPrice : price,
        avgTimeBetweenBlocks: overview.avgTimeBetweenBlocks,
        avgTxGasPrice : overview.avgTxGasPrice,
        avgTxGasUsed : overview.avgTxGasUsed,
        avgTxPerBlock : overview.avgTxPerBlock,
      }
    }

    return (
      <StateContext.Provider
        value={{
          address,
          connect,
          contract,
          checkUserAllowance,
          setAllowance,
          getDecimals,
          getGasLimit,
          getProjects,
          getUserProjectFunds,
          fundProject,
          withdrawFunds,
          claimReward,
          checkUserClaimed,
          withdrawProjectFunds,
          withdrawRemainingRewards,
          transferERC20,
          getBlocks,
          getBlocksData,
          getBlockTxs,
          getTransactionByHash,
          getUserTxs,
          getUserOverview,
          getDashboardOverview
        }}
      >
        {children}
      </StateContext.Provider>
    );
  };


export const useStateContext = () => useContext(StateContext);
