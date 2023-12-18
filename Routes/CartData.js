const express = require("express");
const router = express.Router()
const Cart = require('../models/Cart')
const {body, query, validationResult} = require('express-validator')

router.post("/add_to_cart",[
    body('item', 'Add at least one food item').notEmpty()
],async (req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {email, item, quantity} = req.body
  let user = await Cart.findOne({'email': email})

  if(user === null){
    const cart_item = {
      email: email,
      cart_items:[item],
      total: item.price * quantity
    }
    await Cart.create(cart_item).then(()=>{
      res.json({success: true})
    })
  }else{
    await Cart.findOneAndUpdate({email: email},{
      $push:{cart_items: {$each: [item]}},
      $inc: {total: (item.price * quantity)}
    }).then(()=>{
      res.json({success: true})
    })
  }
})

router.get("/cart",[
  query('email','Please login').notEmpty()
],async (req, res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array() })
  }
  const {email} = req.query
  let cart_items = await Cart.findOne({email: email})
  res.json({success: true, cart_items: cart_items})
})
module.exports = router