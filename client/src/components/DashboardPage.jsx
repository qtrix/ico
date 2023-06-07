import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import DropDownButton from "./DropDownButton";
import BlocksTable from "./BlockTable";
import { Icon } from '@iconify/react';
import { useStateContext } from "../context";
const DashboardPage = () => {
  const [isActive, setIsActive] = useState("dashboard");
    const columns = [
        { id: 'icon', label: '', minWidth: 50 },
        { id: 'number', label: 'Number/Timestamp', minWidth: 100,align: 'center' },
        {
          id: 'NoOfTxs',
          label: 'No of transactions',
          minWidth: 170,
          align: 'center',
          format: (value) => value.toFixed(0),
        },
        {
          id: 'ChainId',
          label: 'ChainId',
          minWidth: 170,
          align: 'center',
          format: (value) => value.toFixed(0),
        },
        {
          id: 'Value',
          label: 'Value',
          minWidth: 170,
          align: 'center',
          format: (value) => value.toFixed(2),
        },
      ];
      // const rows = [
      //   createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //   <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //   <Icon icon="clarity:block-line" />
      //   </span>
      // </div>, 2554,123,1,123),
      //   createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //   <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //   <Icon icon="clarity:block-line" />
      //   </span>
      // </div>, 234,123,1,123),
      //     createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //     <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //     <Icon icon="clarity:block-line" />
      //     </span>
      //   </div>, 234,123,1,123),
      //    createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //    <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //    <Icon icon="clarity:block-line" />
      //    </span>
      //  </div>, 234,123,1,123),
      //     createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //     <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //     <Icon icon="clarity:block-line" />
      //     </span>
      //   </div>, 234,123,1,123),
      //     createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //     <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //     <Icon icon="clarity:block-line" />
      //     </span>
      //   </div>, 234,123,1,123),
      //    createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //    <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //    <Icon icon="clarity:block-line" />
      //    </span>
      //  </div>, 234,123,1,123),
      //     createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //     <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //     <Icon icon="clarity:block-line" />
      //     </span>
      //   </div>, 234,123,1,123),
      //     createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //     <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //     <Icon icon="clarity:block-line" />
      //     </span>
      //   </div>, 234,123,1,123),
      //     createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //     <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //     <Icon icon="clarity:block-line" />
      //     </span>
      //   </div>, 234,123,1,123),
      //     createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //     <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //     <Icon icon="clarity:block-line" />
      //     </span>
      //   </div>, 234,123,1,123),
      //    createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //    <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //    <Icon icon="clarity:block-line" />
      //    </span>
      //  </div>, 234,123,1,123),
      //     createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //     <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //     <Icon icon="clarity:block-line" />
      //     </span>
      //   </div>, 234,123,1,123),
      //     createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //     <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //     <Icon icon="clarity:block-line" />
      //     </span>
      //   </div>, 234,123,1,123),
      //     createData( <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
      //     <span class="mdi mdi:cube-send text-xl sm:text-2xl text-indigo-500">
      //     <Icon icon="clarity:block-line" />
      //     </span>
      //   </div>, 234,123,1,123),
      // ];

    return (
        <div>
           <Stack direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                    sx ={{marginTop:2}}>
            
            <TextField
                    fullWidth
                    label="Search..."
                    id="fullWidth filled-search" type="search"
                    variant="filled"
                
                    style={{ border: '2px solid white' ,borderRadius:10}}
                    InputLabelProps={{
                        style: {
                        color: 'white'
                        }
                    }}
                    inputProps={{
                        style: {
                        color: 'white'
                        }
                    }}
                />
                <DropDownButton />
                <Button variant="contained">Search</Button>
                </Stack>

                <div>
                    <BlocksTable columns = {columns} type ={"block"}/>
                </div>
          </div>
    );
}

export default DashboardPage;