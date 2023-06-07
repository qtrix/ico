import { Icon } from '@iconify/react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
function createData(name, value) {
  return { name, value };
}

const Home = () => {
    
    const [overview,setOverview] = useState([]);
    const {getDashboardOverview} = useStateContext();
    const [rows,setRows] = useState(
         [
            createData('Transactions', 0),
            createData('Blocks', 0),
            createData('ETH Price', 0),
            createData('Avg. time between blocks', 0),
            createData('Avg. tx gas price', 0),
            createData('Avg. tx gas used', 0),
            createData('Avg. transactions/block', 0),
         
        ])

    const getOverview = async () => {
        const data = await getDashboardOverview();
        //console.log(data)
        setOverview(data);
        const rows2 = [
            createData('Transactions', overview.transactions),
            createData('Blocks', overview.blocks),
            createData('ETH Price', overview.ethPrice),
            createData('Avg. time between blocks', Number(overview.avgTimeBetweenBlocks).toFixed(0)),
            createData('Avg. tx gas price', Number(overview.avgTxGasPrice).toFixed(18)),
            createData('Avg. tx gas used', Number(overview.avgTxGasUsed).toFixed(18)),
            createData('Avg. transactions/block', Number(overview.avgTxPerBlock).toFixed(0)),
          
        ];
        setRows(rows2)
    }

    useEffect(() =>{
        setTimeout(()=>{
            getOverview();
        }, 10000)
    });

    console.log(rows)
    return(
        <div>
            <h1 className="font-epilogue font-semibold text-[20px] text-white text-left"> {"Overview"} </h1>
            <div class="flex items-stretch w-full sm:w-1/2">
                <div class="bg-white rounded-xl border border-gray-300 w-full  h-[150px]  py-4 flex flex-col items-center m-2 sm:m-4">
                <div class="w-full h-32 sm:h-48 relative flex items-end justify-center">
                    <div class="flex flex-col items-center">
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
                        <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
                            <Icon icon="mdi:cube-send" />
                        </span>
                    </div>
                    <p class="text-blue-900 text-xl sm:text-2xl font-bold leading-tight mt-2 sm:mt-4">{overview.highestBlockInDb}</p>
                    <p class="text-gray-500 text-xs font-semibold">Highest Block Indexed</p>
                    </div>
                </div>
                </div>
                <div class="bg-white rounded-xl border border-gray-300 w-full  h-[150px]  py-4 flex flex-col items-center m-2 sm:m-4">
                <div class="w-full h-32 sm:h-48 relative flex items-end justify-center">
                    <div class="flex flex-col items-center">
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
                        <span class="mdi clarity:block-line text-xl sm:text-2xl text-indigo-500">
                            <Icon icon="clarity:block-line" />
                        </span>
                    </div>
                    <p class="text-blue-900 text-xl sm:text-2xl font-bold leading-tight mt-2 sm:mt-4">{overview.blocksIndexed}</p>
                    <p class="text-gray-500 text-xs font-semibold">Blocks Indexed</p>
                    </div>
                </div>
                </div>
            </div>
            <div class="flex items-stretch w-full sm:w-1/2">
                <div class="bg-white rounded-xl border border-gray-300 w-full  h-[150px]  py-4 flex flex-col items-center m-2 sm:m-4">
                <div class="w-full h-32 sm:h-48 relative flex items-end justify-center">
                    <div class="flex flex-col items-center">
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
                        <span class="mdi text-xl sm:text-2xl text-indigo-500">
                            <Icon icon="mdi:cube-scan" />
                        </span>
                    </div>
                    <p class="text-blue-900 text-xl sm:text-2xl font-bold leading-tight mt-2 sm:mt-4">{overview.latestBlock}</p>
                    <p class="text-gray-500 text-xs font-semibold">Latest block</p>
                    </div>
                </div>
                </div>
            </div>
            
            <div class="flex items-stretch w-full sm:w-1/2">
                <div class="bg-white rounded-xl border border-gray-300 w-full  h-[300px]  py-4 flex flex-col m-2 sm:m-4">
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 400, maxHeight: 70 }} size="small" aria-label="simple table">
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
                </div>
              
            </div>
  
    );
};

export default Home;
