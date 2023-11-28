const mongoose = require('mongoose')
const mongo_uri = "mongodb+srv://nikhillghadi:lr4hcaKHh8J9ub5x@cluster0.wglo3yk.mongodb.net/food_delivery?retryWrites=true&w=majority"

const  mongoDB=()=> {
  mongoose.connect(mongo_uri).then(async ()=>{
    console.log("DB Connected ")
    const food_items = await mongoose.connection.db.collection("food_items")
    food_items.find({}).toArray().then(async (data,err)=>{
      const food_categories = await mongoose.connection.db.collection("food_categories")
      food_categories.find({}).toArray().then( (cat_data,err)=>{
        if(err){

        }else{
          global.food_items = data
          global.food_categories = cat_data

        }

      })

      

    })
  })
    
}
module.exports =  mongoDB
