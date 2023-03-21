import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ManualBackup from './ManualBackup';
import AutoBackup from './AutoBackup';

const MainTab = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Manual Backup" value="1" />
            <Tab label="Auto Backup" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1"><ManualBackup /></TabPanel>
        <TabPanel value="2"><AutoBackup /></TabPanel>
        
      </TabContext>
    </div>
  );
};

export default MainTab;
