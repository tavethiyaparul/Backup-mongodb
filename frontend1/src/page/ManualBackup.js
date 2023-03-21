import React, { useEffect } from 'react'
import axios from 'axios'
import { Button } from '@mui/material'
import {DataGrid} from '@mui/x-data-grid'
// import { DataGrid } from "@material-ui/data-grid";
import RestoreIcon from '@mui/icons-material/Restore';

const ManualBackup = () => {
  const [arr,setArr] = React.useState([])
  const [flag,setFlag] = React.useState(false)
    const manualBackupData = async()=>{
        console.log("manual backup data")
        const res = await axios.get("http://localhost:5000/backup")
        setFlag(true)
        alert(`${res.data}`)
        // console.log("res",res)
    }

    const manualBackuprestore = async(e,fileName)=>{
      e.stopPropagation();
      console.log("manual backup restore",fileName)
      const res = await axios.post("http://localhost:5000/restore",{fileName}, { headers: "Content-Type: application/json" })
      alert(`${res.data}`)
    }

    const getAll = async()=>{
      const res = await axios.get("http://localhost:5000/all") 
      console.log("res",res.data)
      setArr(res.data)
      setFlag(false)
    }

    useEffect(() => {
      getAll();
    },[flag,arr]);

    const columns = [
      { field: "id", headerName: "No", minWidth: 120, flex: 1 },
      { field: "path", headerName: "path", minWidth: 80, flex: 1, editable: true },
      { field: "fileName", headerName: "file Name", minWidth: 80, flex: 1, editable: true },
      {
          field: "restore",
          flex: 1,
          headerName: "Restore",
          minWidth: 30,
          type: "number",
          sortable: false,  
          renderCell: (params) => {
            console.log("params",params)
            return (
              <RestoreIcon onClick={(e) => manualBackuprestore(e,params.row.fileName)} />
            );
          },
        },
      ];

      const rows = [];

      arr && arr.length > 0 && arr.map((item) => rows.push({
        id: item._id,
        path:item.path,
        fileName:item.fileName
      })
      );
  return (
    <div>

        <div>
        <h3> Manual MongoDb Database Backup</h3>
        <Button variant="contained" onClick={manualBackupData}>Backup</Button>
        <br />
        <br />
        {/* <Button variant="contained" onClick={manualBackuprestore}>Restore</Button> */}
        </div>
        <br />
        <div>
        <DataGrid
          checkboxSelection={true}
          rows={rows}
          columns={columns}
          pageSize={10}
          autoHeight
          rowsPerPageOptions={[2, 5, 10]}
          
        />
      </div>
    </div>
  )
}

export default ManualBackup