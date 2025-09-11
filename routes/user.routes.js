const { hash, compare } = require('bcrypt');
const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Auth = require('../middleware/auth');
const User = require("../models/User");
const dotenv = require("dotenv")
const router = Router();
dotenv.config()
router.post(
  '/user/register',

  [check('name').not().isEmpty().trim().escape().isLength({min:5}).withMessage("Name must have more than 5 characters"),
   check("email").not().isEmpty().isEmail().withMessage("Enter A Valid Email"),
   check("password").not().isEmpty().isLength({min:8}).withMessage("Enter a Valid Password")
],
  async (req, res) => {
    const errors = validationResult(req);
    

    if (!errors.isEmpty()) {
      let err = errors.array()
      return res.status(422).json({message:err[0].msg})}
    try {
      const { email, password, name  } = req.body;
      if (!name || !email || !password)return res.send('Enter All Fields');

     const user = await  User.findByEmail(email)
     if(user)return res.status(404).send({message:"User already there"})
     const user1 = new User({...req.body})
     const token = await user1.generateToken()
     console.log(token,'token')
    //  const watchList = new WatchList({userId:user1._id})
    //  await watchList.save()
     res.status(201).json({user:user1})

    } catch (err) {
      console.log(err)
      if (err.name === 'ValidationError') {
        return res.status(400).json({Validation_Error: err.message});
      }
      res.status(500).json({message:"server error2",status:500})
      
    }
  }
);
// .matches(/\d/)d 


router.post("/user/login", async (req,res)=>{
  try{
    const {email , password} = req.body
    if(!email || !password)return res.status(404).send({message:"enter a valid Input",status:404})
    const user = await User.findByEmailAndPassword(email,password)
    if(!user) return res.send({message:"user Not Found"})
    const token = await user.generateToken()
    res.status(201).json({user:user})
  }catch(err){
    if(err.message === "user not found") return res.status(404).send({message:err.message}) 
    if(err.message === "type Valid Password") return res.status(404).send({message:err.message}) 
    res.status(500).send(err.message)
    console.log(err)
  }
})


// login user can change the password 
router.patch("/user/changePassword",Auth,
[check("newpassword").not().isEmpty().isLength({min:8}).withMessage("Enter a Valid Password"),
check("oldpassword").not().isEmpty().isLength({min:8}).withMessage("Enter a Valid Password")
]
, async (req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let err = errors.array()
      return res.status(422).json(err[0].msg)}
    const user = req.user
    const {newpassword , oldpassword} = req.body
    if(!newpassword || !oldpassword) return res.status(404).send({message:"invalid credentials"})
    const check = await compare(oldpassword,user.password)
    console.log(check)
    if(!check) return res.status(404).send({message:"this is not your old password"})
    const hashPassword = await hash(newpassword,10)
    const changePassword = await User.updateOne({token:user.token},{password:hashPassword},{new:true})
    res.status(200).send({message:" Password updated",changePassword})
  }catch(err){
    console.log(err)
    res.status(500).send({message:"server Error"})
  }
})

router.delete("/user/logout",Auth ,async (req,res)=>{
  try{
    const user = req.user
    user.token = null
    await user.save()
    res.status(201).send({message:"User Logout",status:201})
  }catch(err){
    res.status(500).send({message:"server error"})
  }
})

router.get("/userByToken/:token", async (req,res)=>{
  try{
    const token = req.params.token
    const user = await User.findOne({token:token })
    if(!user) return res.status(404).send({message:"cannot get user"})
    res.status(201).json({user:user})
  }catch(err){
    console.log(err)
    res.status(500).send("server error")
  }
})

router.get("/user/get/:token", async(req,res)=>{
  try{
    const token = req.params.token
    const user = await User.findOne({passwordToken:token })
    if(!user) return res.status(404).send({message:"cannot get user"})
    res.status(201).json({user:user})
  }catch(err){
    console.log(err)
    res.status(500).send("server error")
  }
})


module.exports = router;