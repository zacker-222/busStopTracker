import React from 'react'
import BottomNavigation from './BottomNavigation';
import Header from './Header';
import BusStopTab from './BusStopTab';
import BusStopTab2 from './BusStopTab2';
import { useState } from 'react';
import Edit from './Edit';
import Delete from './Delete';

const App = () => {
  
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);

  const handleChange = (tab) => {
    setTab(tab);
  }

  return (
    <div>
      <Header />
      {
        tab === 0 ? <BusStopTab tabid = {tab}/> : tab === 1 ? <BusStopTab2 tabid = {tab} /> : tab === 2 ? <Edit /> : <Delete />
      }
      <BottomNavigation callback = {handleChange}/>
    </div>
  )
}

export default App;