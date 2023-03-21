import React, { useEffect } from 'react'
import axios from 'axios'
import { Button } from '@mui/material'
import {DataGrid} from '@mui/x-data-grid'
import RestoreIcon from '@mui/icons-material/Restore';

const AutoBackup = () => {
  const [arr,setArr] = React.useState([])
  const [flag,setFlag] = React.useState(false)
    const autoBackup =async() =>{
        console.log("Auto Backup..")
        const res = await axios.get("http://localhost:5000/auto")
        setFlag(true)
        alert(`${res.data}`)
      }

      const autoBackuprestore = async(e,fileName)=>{
        e.stopPropagation();
        console.log("auto backup restore",fileName)
        const res = await axios.post("http://localhost:5000/restore",{fileName}, { headers: "Content-Type: application/json" })
        alert(`${res.data}`)
      }

      const getAll = async()=>{
        const res = await axios.get("http://localhost:5000/allauto") 
        console.log("res",res.data)
        setArr(res.data)
        setFlag(false)
      }
    
    useEffect(() => {
      getAll();
    }, [flag,arr]);

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
              return (
                <RestoreIcon onClick={(e) => autoBackuprestore(e,params.row.fileName)} />
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
    <>
        <div>
        <h3> Auto MongoDb Database Backup</h3>
        <Button variant="contained" onClick={autoBackup}>Backup</Button>
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
        {/* <Button variant="contained" >Restore</Button> */}

    </>
  )
}

export default AutoBackup