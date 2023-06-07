import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BlocksTable from "./BlockTable";
import { Icon } from '@iconify/react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useStateContext } from "../context";
import TransactionTable from "./TransactionTable";

const BlocksPage = (blockNumber,chainId,handleClick) => {
  const { state } = useLocation();
  const [rows, setRows] = useState([])
  const [rows2, setRows2] = useState([])
  const [noTxs,setNoTxs] = useState(0)
  const [isActive, setIsActive] = useState("dashboard");
  function createData(name, value) {
    return { name, value };
  }

    const {getBlocksData} = useStateContext();
  const fetchBlockData = async () => {
    const data = await getBlocksData(state.number,state.chainId);
    setNoTxs(data.noOfTxs)
    const rows13 = [
      createData('Block Height', data.number),
      createData('Transactions', data.noOfTxs),
      createData('Block hash', data.blockHash),
      createData('Parent hash', data.parentBlockHash),
    ]
    setRows(rows13)
    const rows23 = [
      createData('Gas Used', data.gasUsed),
      createData('Gas limit', data.gasLimit),
      createData('Timestamp', data.blockCreationTime),
      createData('ChainId', state.chainId),
    ]
    setRows2(rows23)
  };
  
  React.useEffect(() => {
    fetchBlockData();
    return () => {
      console.log('This will be logged on unmount');
    };
  }, []);



   
    return (
        <div>
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
                    <TransactionTable  number={state.number} chainId = {state.chainId} noTxs = {noTxs}/>
                </div>
          </div>
    );
}

export default BlocksPage;