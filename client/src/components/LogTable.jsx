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

export default function LogsTable(rows,noLogs) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const[noOfRows,setNoOfRows] = React.useState(10);
  const navigate = useNavigate();
  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
       await fetchTransactions(newPage)
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { id: 'icon', label: '', minWidth: 50 },
    { id: 'logIndex', label: 'Log Index', minWidth: 50,align: 'center' },
    {
      id: 'topic0',
      label: 'Topic0',
      minWidth: 170,
      align: 'center',
      format: (value) => value.toFixed(0),
    },
    {
      id: 'data',
      label: 'Data',
      minWidth: 170,
      align: 'center',
      format: (value) => value.toFixed(0),
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
            {rows.rows.slice()
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code} selected >
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
        count={rows.noLogs}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}