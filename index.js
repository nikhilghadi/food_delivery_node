const express = require('express')
const mongoDB = require('./db')
const cors = require('cors');
const app = express()
const port = 3001
mongoDB()
app.use(cors()) 
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin",'*')
  res.header("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept");
  next()
})
app.use(express.json())
app.use("/api", require("./Routes/CreateUser"))
app.use("/api",require("./Routes/FoodItems"))
app.use("/api", require("./Routes/OrderData"))
app.listen(port, ()=>{
  console.log(`App listening on ${port}`)
})