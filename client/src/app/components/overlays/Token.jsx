import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

function Token() {
    const [token,setToken]=useState(0);
    const data=useSelector(state=>state.user);
    useEffect(()=>{

      setToken(data?.money)
    },[data])
  return (
    <>
        <div className='tokenBox'>
            Amount: {token}
        </div>
    </>
  )
}

export default Token