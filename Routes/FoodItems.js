const express = require('express')
const router = express.Router()

router.get('/food_data',(req, res)=>{
  try {
    res.send([global.food_items, global.food_categories])
    
  } catch (error) {
    
  }
})
module.exports = router