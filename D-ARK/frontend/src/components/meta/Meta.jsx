import React, { useState } from 'react'
import PhaserGame from './PhaserGame.js'
import Marketplace from '../overlays/Marketplace.jsx'
import { useSelector } from 'react-redux';
import Inventory from '../overlays/Inventory.jsx';
import Token from '../overlays/Token.jsx';


function Meta() {
  const popupVisible=useSelector(state=>state.popupVisible);


  return (
    <>
      <PhaserGame />
      {popupVisible && <Marketplace />}
      <Inventory/>
      <Token/>
    </>
  )
}

export default Meta