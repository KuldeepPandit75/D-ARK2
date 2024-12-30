import React, { useState } from 'react'

function Token() {
    const [money,setMoney]=useState(100);
  return (
    <>
        <div className='tokenBox'>
            Amount: {money}
        </div>
    </>
  )
}

export default Token