import React, { useState } from 'react'

function Marketplace() {

    const [selectedItems, setSelectedItems] = useState([]);

  
  
    const handleItemClick = (e) => {
      setSelectedItems((prev) =>
        prev.includes(e.target.id)
          ? prev.filter((id) => id !== e.target.id)
          : [...prev, e.target.id]
      );
      e.target.className+="added"
    };
  
    const handleButtonClick = () => {
        alert(`Added ${selectedItems.length} items to inventory!`);
        setSelectedItems([]); // Reset after purchase
    };
  
    return (
      <div className="marketplace">
  
          <div className="popup">
            <div className="items-grid">
              <div id='item1' onClick={(e)=>handleItemClick(e)}></div>
              <div id='item2' onClick={(e)=>handleItemClick(e)}></div>
              <div id='item3' onClick={(e)=>handleItemClick(e)}></div>
              <div id='item4' onClick={(e)=>handleItemClick(e)}></div>
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