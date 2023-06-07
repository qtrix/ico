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

export default function BlocksTable(columns,type,number,chainId,noTxs) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows,setRows] = React.useState([]);
  const[noOfRows,setNoOfRows] = React.useState(10000);

  const navigate = useNavigate();
  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    if(columns.type == "block"){
       await fetchBlocks(newPage);

    }
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = (row) => {
    if(columns.type == "block"){
        navigate(`/dashboard/blocks/${row.number}`, { state: {"number": row.number, "chainId": row.ChainId} });
    }
  } 
  
  const {getBlocks} = useStateContext();
  const fetchBlocks = async (pageNo) => {
    var offset;
    console.log(pageNo)
    if (pageNo == 0) {
      offset = 0;
    }else{
      var offset = (pageNo - 1) * rowsPerPage
    }

    const data = await getBlocks(rowsPerPage,offset);
    setRows(data);
  };

  React.useEffect(() => {
    fetchBlocks(0);
    return () => {
      console.log('This will be logged on unmount');
    };
  }, []);

  

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop:5, borderRadius:5 }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {Array.from(columns.columns).map((column) => (
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
                    {columns.columns.map((column) => {
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
        count={noOfRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}