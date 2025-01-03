import React, { useState } from 'react'
import { API } from "../../../service/api.js"
import { useDispatch } from 'react-redux';
import { reFetchData } from '../../../features/slice.js';

function Marketplace() {

  const [selectedItems, setSelectedItems] = useState([]);
  const dispatch=useDispatch();

  const items = [
    {
      name: "sword",
      url: "/sword.png",
      price: 100
    },
    {
      name: "bow",
      url: "/bow.png",
      price: 200
    }
    ,
    {
      name: "arrow",
      url: "arrow.png",
      price: 50
    },
    {
      name: "axe",
      url: "/axe.png",
      price: 300
    }];

  const handleItemClick = (e) => {
    setSelectedItems((prev) =>
      prev.includes(e.target.id)
        ? prev.filter((id) => id !== e.target.id)
        : [...prev, e.target.id]
    );
    console.log(selectedItems)
    e.target.classList.toggle("added")
  };

  const handleButtonClick = async () => {

    const response = await API.buyItems({ username: "kullu", items: selectedItems })

    if(response.isSuccess){
      dispatch(reFetchData());
    }

    alert(`Added ${selectedItems.length} items to inventory!`);
    selectedItems.forEach(selectedItem => {
      document.getElementById(selectedItem).classList.toggle("added");
    })
    setSelectedItems([]); // Reset after purchase

  };

  return (
    <div className="marketplace">

      <div className="popup">
        <div className="items-grid">
          {items.map((item, idx) => (
            <div key={idx} onClick={(e) => handleItemClick(e)}>
              <img src={item.url} id={item.name} className='items' height={50} />
              <h6 style={{color:"black"}}>{item.name}<br />{item.price}</h6>
            </div>
          ))}
        </div>
        <div className="button-container">
          <button className="toggle-button" onClick={handleButtonClick} >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}

export default Marketplace