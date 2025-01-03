import React, { useEffect, useState } from 'react'
import PhaserGame from './PhaserGame.js'
import Marketplace from '../overlays/Marketplace.jsx'
import { useSelector } from 'react-redux';
import Inventory from '../overlays/Inventory.jsx';
import Token from '../overlays/Token.jsx';
import { API } from '../../../service/api.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../features/slice.js';


function Meta() {
  const popupVisible=useSelector(state=>state.popupVisible);
  const refetch=useSelector(state=>state.refetch)
  const dispatch=useDispatch();

  const account={
    username:"kullu"
  }

  useEffect(()=>{
    const fetchData=async()=>{

      try {
        const response=await API.getUserInfo(account);
        console.log("aaaaaaaaaaa",response);
        dispatch(setUser(response.data));
        // localStorage.setItem("userData",JSON.stringify(response))
      } catch (error) {
        console.error("error fetching data:",error)
      }
    }
    fetchData();
  },[refetch])


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