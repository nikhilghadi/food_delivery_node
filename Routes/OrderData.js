const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const {body, query, validationResult} = require('express-validator')
router.post('/create_order',[
  body('orders', 'Add at least one food item').notEmpty()
],async (req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {email, orders, order_date} = req.body
  let total = orders.reduce((a,i)=>a+i.price,0)
  await orders.splice(0,0, {order_date: order_date, total: total})
  let user = await Order.findOne({'email': email})
  if(user === null){
    const order = {
      email: email,
      orders: orders
    }
    await Order.create(order).then(()=>{
      res.json({success: true})
    })
  }else{
    await Order.findOneAndUpdate({email: email},
      {
        $push:{orders: {$each: orders}}
      }).then(()=>{
      res.json({success: true})
      })
  }
 
})
router.get('/my_orders', [
  query('email','Please login!').notEmpty()
],async (req, res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array() })
  }
  const {email} = req.query
  let orders = await Order.findOne({email: email})
  res.json({success: true, orders: orders})
})
module.exports = router