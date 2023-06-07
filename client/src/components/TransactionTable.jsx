import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context";

export default function TransactionTable(number,chainId,noTxs) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows,setRows] = React.useState([]);
  const[noOfRows,setNoOfRows] = React.useState(10000);
  const navigate = useNavigate();
  const handleChangePage = async (event, newPage) => {
    setPage(newPage);

       await fetchTransactions(newPage)

  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = (row) => {
      navigate(`/dashboard/transactions/${row.txHash}` ,{state : row.txHash});
    
  } 

  const {getBlocks,getBlockTxs} = useStateContext();
  const fetchTransactions = async (pageNo) => {
    var offset;
    console.log(pageNo)
    if (pageNo == 0) {
      offset = 0;
    }else{
      var offset = (pageNo - 1) * rowsPerPage
    }
    console.log(number,chainId,noTxs)
    const data = await getBlockTxs(number.number,number.chainId,rowsPerPage,offset);
    setRows(data);
    //setNoOfRows(columns.noTxs)
  }

    //   //console.log(columns)
    //   if(columns.type == "block"){
    //     React.useEffect(() => {
    //       fetchBlocks(0);
    //     }, []);
    //   }else if(columns.type == "transaction"){
    //     React.useEffect(() => {
    //       setNoOfRows(columns.noTxs)
    //       fetchTransactions(0);
    //     }, []);
    //   }else if(columns.type == "logs"){
    //     React.useEffect(() => {
    //       setRows(columns.rows)
    //     }, []);
    //   }
    React.useEffect(() => {
              setNoOfRows(columns.noTxs)
              fetchTransactions(0);
              return () => {
                console.log('This will be logged on unmount');
              };
    }, []);
    const columns = [
        { id: 'icon', label: '', minWidth: 50 },
        { id: 'txHash', label: 'Transaction hash', minWidth: 100 },
        {
        id: 'from',
        label: 'From',
        minWidth: 170,
        align: 'center',
        format: (value) => value.toFixed(0),
        },
        {
        id: 'to',
        label: 'To',
        minWidth: 170,
        align: 'center',
        format: (value) => value.toFixed(0),
        },
        {
            id: 'txIndex',
            label: 'TxIndex',
            minWidth: 170,
            align: 'center',
            format: (value) => value.toFixed(0),
        },
        {
        id: 'value',
        label: 'Value',
        minWidth: 170,
        align: 'center',
        format: (value) => value.toFixed(2),
        },
    ];

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop:5, borderRadius:5 }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {Array.from(columns).map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice()
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code} selected onClick={() => handleClick(row)}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell 
                        key={column.id} 
                        align={column.align} 

                      >
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={number.noTxs > 0 ? number.noTxs : noOfRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}