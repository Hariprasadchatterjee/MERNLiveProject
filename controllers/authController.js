const User = require("../model/user")
const bcrypt = require("bcryptjs")
const sendGrid = require("@sendgrid/mail")
const {validationResult} = require("express-validator")
const { NameValidator, EmailValidator, passwordValidator, confirmPasswordValidator, userTypeValidator } = require("../validation/loginAndRegisterValidation")


const sendGrid_key= process.env.SEND_API_KEY;

sendGrid.setApiKey(sendGrid_key)

exports.getLoginC=(req,res,next)=>{
  res.render("auth/login.ejs",{pageTitle:"loginPage",isLogedIn:false})
}
exports.getRegisterC=(req,res,next)=>{
  res.render("auth/singup.ejs",{pageTitle:"singupPage",isLogedIn:false})
}
exports.getForgotC=(req,res,next)=>{
  res.render("auth/forgotPass.ejs",{pageTitle:"forgotPassPage",isLogedIn:false})
}
exports.getResetC=(req,res,next)=>{
  const {email} = req.query
  res.render("auth/reset_password.ejs",{pageTitle:"resetPage",isLogedIn:false,email:email})
}

exports.postResetC=[
  passwordValidator,
  confirmPasswordValidator,
 async (req,res,next)=>{
  const {email,OTP,password,cfpassword} = req.body;
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/reset_password.ejs",
    { pageTitle:"reset_password",
    isLogedIn:false,
    errorMessages:errors.array().map( (err)=>err.msg),
    email:email,
    
    })
  }
  
    try {
      console.log("haha",req.body);
      console.log("hr email",email);
      
      const user = await User.findOne({OTP});
      console.log("hr user",user);
      
    if (!user) {
      throw new Error("user not found")
    }
    else if(user.OTP_Ex < Date.now()){
      throw new Error("otp Expired")
    }
    else if(user.OTP!==OTP){
      throw new Error("otp not Matched")
    }
    const hashPassword =  bcrypt.hash(password,12)
    user.password=(await hashPassword).toString()
    user.OTP = undefined
    user.OTP_Ex = undefined
    await user.save()
    res.redirect("/login")
    } catch (error) {
      return res.status(422).render("auth/reset_password.ejs",
        { pageTitle:"forgotPage",
        isLogedIn:false,
        errorMessages:[error.message],
        email:email,
        
        })
    }
  }
]

exports.postForgotC=async(req,res,next)=>{
  const {email} = req.body
  try {
    const user =await User.findOne({email})
    console.log("my user",user);
    
    const OTP = Math.floor(10000 + Math.random()*900000).toString()
    user.OTP = OTP;
    user.OTP_Ex = Date.now() + 5 * 60 *1000;
    await user.save()

    const forgotEmail = {
      to:email,
      from:process.env.FROM_EMAIL,
      
      subject:`Here is your OTP  for reset password`,
      html:`
      <h1> ${OTP} </h1>
      <p>Enter this otp on <a href=http://localhost:3001/reset_password?email=${email}">Page</a> </p>
      `
    }
    await sendGrid.send(forgotEmail)
    res.redirect(`/reset-password?email=${email}`)
  } catch (error) {
    return res.status(422).render("auth/forgotPass.ejs",
      { pageTitle:"forgotPage",
      isLogedIn:false,
      errorMessages:[error.message],
      oldInput:req.body,
      })
  }
}

exports.postLoginC=[
  EmailValidator,
  passwordValidator,

  async(req,res,next)=>{
    const errors = validationResult(req)
    const AllErrors= errors.array().map( (curErr)=>curErr.msg)
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/login.ejs",{
        pageTitle:"loginPage",
        isLogedIn:false,
        errorMessages:AllErrors
      })
    }
    try {
      const {email,password} = req.body;
      const user = await User.findOne({email})
      if (!user) {
        throw new Error("User not Found")
      }
      const isMatch = await bcrypt.compare(password,user.password)
      if (!isMatch) {
        throw new Error("password doesn't match")
      }
      req.session.isLogedIn =true
      req.session.user=user
      await req.session.save()
      res.redirect("/")
    } catch (error) {
      return res.status(422).render("auth/login.ejs",{
        pageTitle:"loginPage",
        isLogedIn:false,
        errorMessages:[error.message]
      })
    }

}
]
exports.postRegisterC= [

  NameValidator,
  EmailValidator,
  passwordValidator,
  confirmPasswordValidator,
  userTypeValidator,

  async (req,res,next)=>{
    const errors = validationResult(req)
    console.log(errors);
    const AllErrors = errors.array().map( (curErr)=>curErr.msg)
    console.log(AllErrors);
    
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/singup.ejs",{
        pageTitle:"singupPage",
        isLogedIn:false,
        errorMessages:AllErrors,
        oldInput:req.body
      })
    }
    

  const {name,email,password,cfpassword,userType} = req.body;
  try {
   const hashpassword = await bcrypt.hash(password,12)
    console.log(name,email,hashpassword,cfpassword,userType);
    const myUser = new User({name,email,password:hashpassword,cfpassword,userType})
    
    await myUser.save()
    res.redirect("/login")
   
    } catch (error) {
      return res.status(422).render("auth/singup.ejs",{
        pageTitle:"singupPage",
        isLogedIn:false,
        errorMessages:[error],
        oldInput:req.body
        
      })
    }
  
}
]
exports.handlelogoutC=(req,res,next)=>{
  console.log(req.session.isLoggedIn,req.body);
  req.session.destroy();
  res.redirect("/login")
}