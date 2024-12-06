const Home = require("../model/homeData");
const User = require("../model/user");
const path = require("path")

exports.gethomeC=( async(req,res,next)=>{

  try {
    const homeData = await Home.find()
    res.render("customersViews/homeList.ejs",{homeData:homeData,pageTitle:"homePage",isLogedIn: req.session.isLogedIn, user: req.session.user})
  } catch (error) {
    console.log("error while fetching homeDatas from database",error.message);
  }
 

})

exports.getdetailsC= async ( req,res,next)=>{
  const id = req.params.homeId;
  console.log(" your home id is", id);
  try {
    const homes = await  Home.findById(id)
    if (!homes) {
      console.log("home not found");
      res.redirect("/")
    }
    res.render("customersViews/details.ejs",{product:homes,pageTitle:"homePage",isLogedIn: req.session.isLogedIn, user: req.session.user})
  } catch (error) {
      console.log(error);
      
  }
  
}

exports.getFavouriteC= async ( req,res,next)=>{
  const userId = req.session.user._id
  try {
    const myUserFavouriteHome = await User.findById(userId).populate("favouriteHome")
    const myFavHome= myUserFavouriteHome.favouriteHome.map( (curHome)=>curHome)
    console.log("hellow",myUserFavouriteHome);
    console.log("hellow hari",myFavHome);
    
    res.render("customersViews/favouriteList.ejs",{Favitems:myFavHome,pageTitle:"favouritePage",isLogedIn: req.session.isLogedIn, user: req.session.user})
  } catch (error) {
    console.log(error);
      res.redirect("/")
  }
  
}

exports.postFavouriteC=async( req,res,next)=>{
  const{ favId }= req.body;
  console.log("fav id",favId);
  const userId = req.session.user._id
  try {
    const myUser = await User.findOne({_id:userId})
    if (!myUser.favouriteHome.includes(favId)) {
       myUser.favouriteHome.push(favId)
      await myUser.save()
      // res.redirect("/customer/favourite")
    }
  } catch (error) {
    console.log(error);
  }
  finally{
    res.redirect("/customer/favourite")
  }

  
}


exports.postDeleteFavouriteC=async( req,res,next)=>{
  const dltId = req.params.deleteId;
  console.log("dltId id",dltId);
  const userId = req.session.user._id
  console.log("user id",userId);
  
  try {
    const delt= await User.findOneAndUpdate({_id:userId},{$pull:{favouriteHome:dltId}})
    console.log( "hari",delt);

  } catch (error) {
    console.log("error while deleting favouriteHome",error);
  }
  finally{
    res.redirect("/customer/favourite")
  }
 
}

exports.getRulesC=[
  (req,res,next)=>{
    if (!req.session.isLogedIn) {
      return res.redirect("/login")
    }
    next()
  },
  (req,res,next)=>{
  // const houseId = req.params.houseId;
  const fileName = 'JoystnaBIODATA.pdf';
  const filePath = path.resolve("rules",fileName)
  // res.sendFile(filePath)
  res.download(filePath,"rules.pdf")
}]