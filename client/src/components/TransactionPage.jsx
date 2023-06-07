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
import LogsTable from "./LogTable";
import { Dashboard } from "../pages";
import { ErrorBoundary } from "react-error-boundary";
const TransactionPage = (txHash,handleClick) => {
    const { state } = useLocation();
    const [rows,setRows] = useState([]);
    const [rows2,setRows2] = useState([]);
    const [rows3,setRows3] = useState([]);
    const [isActive, setIsActive] = useState("dashboard");
    function createDataForTable(icon, logIndex, topic0, data) {
        return { icon, logIndex, topic0 ,data };
    }

    function createData(name, value) {
        return { name, value };
    }



    const {getTransactionByHash} = useStateContext();
    React.useEffect(async () => {
        var [tx,logs] = await getTransactionByHash(state)
        const rows12 = [
            createData('Tx Hash', String(tx.txHash).slice(0,20)+'...'),
            createData('Status', tx.status),
            createData('Block', tx.block),
            createData('From', tx.from),
            createData('To', tx.to),
          ];
        setRows(rows12)

        const rows22 = [
            createData('Msg gas limit', tx.msgGasLimit),
            createData('Gas Used', tx.gasUsed),
            createData('Gas Price', tx.gasPrice),
            createData('NoOfLogs', tx.noOfLogs),
            createData('Value', tx.value),
        ]
        setRows2(rows22)
        //console.log(logs)
        setRows3(logs)
        return () => {
            console.log('This will be logged on unmount');
          };
      }, []);

    

    console.log(rows3)
    return (
        <div>
          <div class="flex items-stretch w-full flex-wrap: nowrap">
                <div class="bg-white rounded-xl border border-gray-300 w-full  h-[250px]  py-4 flex flex-col m-2 sm:m-4">
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

                <div class="bg-white rounded-xl border border-gray-300 w-full  h-[250px]  py-4 flex flex-col m-2 sm:m-4">
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
                    <LogsTable  rows = {rows3} noLogs={rows3.length} />
                </div>
          </div>
          
    );
}

export default TransactionPage;