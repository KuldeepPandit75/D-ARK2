import Item from "../models/item.js"
import User from "../models/user.js";


export const buyItems = async (req, res) => {
    try {
      const { username, items } = req.body;
  
      console.log(username, items);
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      const purchasePromises = items.map(async (item) => {
        const buyProd = await Item.findOne({ name: item });
        if (!buyProd) {
          throw new Error(`Item not found: ${item}`);
        }
  
        if (user.money < buyProd.price) {
          throw new Error(`Insufficient funds for ${item}`);
        }
  
        return buyProd;
      });
  
      const purchases = await Promise.all(purchasePromises);
  
      const updatedItems = [...user.items, ...purchases.map((p) => p)];
      const updatedMoney = user.money - purchases.reduce((sum, p) => sum + p.price, 0);
  
      await User.findOneAndUpdate({ username }, { items: updatedItems, money: updatedMoney });
  
      return res.status(200).send("Items Purchased Successfully!");
  
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ msg: error.message || "Error buying items" });
    }
  };
  

export const addStock=(req,res)=>{
    try {
        const{name,price,category,url}=req.body;

        const newItem= new Item({
            name,price,category,url
        })

        newItem.save();

        return res.status(200).send("Item Added Successfully!")

    } catch (error) {
        return res.status(500).json({msg:"error buying items"})
    }
}

export const getStock=(req,res)=>{
    try {
        const stock= Item.find();

        return res.status(200).json(stock);

    } catch (error) {
        return res.status(500).json({msg:"error buying items"})
    }
}