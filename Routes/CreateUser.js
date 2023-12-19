const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body,query, check,validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET =  "DSFSDGBBfdkvSDASDSWADEWAD"
function checkUser(email) {
  return User.findOne({email:email})
}
router.post('/create_user',
[body('name',"Please enter name.").notEmpty(),
body('email',"Invalid Email").isEmail(),
body('password',"Invalid Password").isLength({min: 5})
]
, async(req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {name, password, email, location} = req.body
    let existing_user = await checkUser(email)
    if(existing_user){
      res.json({success: false, message: "Email already Registered"})
      return
    }
      let salt = await bcrypt.genSalt(10)
      let sec_pwd = await bcrypt.hash(password,salt)
       const user = await User.create({
        name:name,
        password:sec_pwd,
        email:email,
        location:location
      })
      res.json({success: true})
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error})

  }
})

router.post("/login", (req,res)=>{
  let email = req.body.email
  let password = req.body.password
  try {
    User.findOne({email:email}).then(async (user)=>{
      if (user){
        const pwd_compare = await bcrypt.compare(password,user.password)
        if (!pwd_compare){
          res.json({success: false, message: "Wrong Credentials"})
        }else{
          const data = {
            user:{
              id:user.id
            }
          }
          const authToken = jwt.sign(data,JWT_SECRET)
          res.json({success: true, authToken: authToken, email: user.email, name: user.name, location: user.location})

        }
      }
      else
      res.json({success: false, message: "Wrong Credential"})

    }).catch((err)=>{
      res.json({success: false, message: err})
    })
  } catch (error) {
    res.json({success: false, message: err})
  }
})

router.get("/verify_token",(req,res)=>{
  const authToken = req.headers.authorization;
  jwt.verify(authToken.replace('YoYo ',''), JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    User.findById( decoded.user.id).then((user)=>{
      res.json({success: true, authToken: authToken, email: user.email, name: user.name, location: user.location})
    })
  });
})
module.exports = router