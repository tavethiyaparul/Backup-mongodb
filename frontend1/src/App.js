import React from 'react'
import {Routes, Route} from 'react-router-dom';
import ManualBackup from './page/ManualBackup';
import Login from './page/Login';
import MainTab from './page/MainTab';

const App = () => {
  return (
    <div>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/backup" element={<ManualBackup />} />
        <Route path="/tab" element={<MainTab />} />
    </Routes>
  </div>
  )
}

export default App