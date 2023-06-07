import React, { useEffect, useState } from "react";
import BlocksTable from "../components/BlockTable";
import { Icon } from '@iconify/react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import WalletTable from "../components/WalletTable";
import { useStateContext } from "../context";
import { ErrorBoundary } from "react-error-boundary";
const Wallet = () => {
    const [isActive, setIsActive] = useState("wallet");
    const [noOfTxs,setNoOfTxs] = useState(0);
    const [rows,setRows] = useState(
      [  
        createData('ETH Balance', 0),
        createData('Transactions Sent', 0),
        createData('Transaction Received', 0)
      ])
    const [rows2,setRows2] = useState([ 
      createData('USDC', 0),
      createData('ETH', 0),
      createData('USDT', 0),
      createData('BNB', 0),
      createData('AAVE', 0),
    ])
    function createData(name, value) {
        return { name, value };
    }
    function createDataForTable(icon, txHash, from, to,txIndex,value) {
        return { icon, txHash, from, to,txIndex, value };
    }

    const {getUserOverview,address} = useStateContext();
    const fetchOverview = async () => {
        const data = await getUserOverview();
        setNoOfTxs(data.totalTxs);

        const rows12 = [
          createData('ETH Balance', data.ethBalance),
          createData('Transactions Sent', data.txSent),
          createData('Transaction Received', data.txReceived),
        ];
        setRows(rows12)
        console.log(data)
    }
    

    React.useEffect(() => {
      setTimeout(()=>{
        if (address){
          fetchOverview();
        }
       }, 2000)
       return () => {
        console.log('This will be logged on unmount');
      };
    });
    
    
    return(
        <div>
            <h1 className="font-epilogue font-semibold text-[20px] text-white text-left"> {"My wallet"} </h1>
            <div class="flex items-stretch w-full flex-wrap: nowrap">
                <div class="bg-white rounded-xl border border-gray-300 w-full  h-[230px]  py-4 flex flex-col m-2 sm:m-4">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 400, maxHeight: 80 }} size="small" aria-label="simple table">
                            <TableHead>
                            </TableHead>
                            <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.value}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <div class="bg-white rounded-xl border border-gray-300 w-full  h-[230px]  py-4 flex flex-col m-2 sm:m-4">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 400, maxHeight: 70 }} size="small" aria-label="Overview">
                            <TableHead>
                            </TableHead>
                            <TableBody>
                            {rows2.map((row) => (
                                <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.value}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

            <div>
              <WalletTable  noOfTxs={noOfTxs}/>
                </div>
        </div>
  
    );
};

export default Wallet;
