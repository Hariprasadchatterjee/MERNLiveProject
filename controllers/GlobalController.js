const Home = require("../model/homeData")
exports.indexC=(async (req,res,next)=>{
  try {
    const homeData= await Home.find()
    res.render("index.ejs",{homeData:homeData,pageTitle:"indexPage",isLogedIn: req.session.isLogedIn,user: req.session.user})
  } catch (error) {
    console.log("error while fetching homeDatas from database",error.message);
  }
  // Home.find().then( (homeData)=>{
  //   res.render("index.ejs",{homeData:homeData,pageTitle:"indexPage",isLogedIn:req.session.isLogedIn,user:req.session.user})
  // }).catch( (error)=>{
  //   console.log("error while fetching homeDatas from database",error.message);
  // })
})
