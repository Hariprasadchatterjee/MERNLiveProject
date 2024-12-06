const Home = require("../model/homeData");
const { deleteFile } = require("../utils/file");
const path = require("path")

exports.addhomeC=( async (req,res,next)=>{
  try {
    res.render("hostViews/Add_Edit_home.ejs",{pageTitle:"AddhomePage",editing:false,isLogedIn: req.session.isLogedIn, user: req.session.user})
  } catch (error) {
    console.log(error);
    
  }

})

exports.handleEdithomeC=( async (req,res,next)=>{
  const EditId= req.params.editId;
  const editing = req.query.editing==="true"?true:false
  console.log(EditId,editing);
  if (!editing) {
    res.redirect("/host/host-homelist")
  }
  try {
    const home = await Home.findById(EditId)
    if (!home) {
      res.redirect("/host/host-homelist")
    }
    else{

      res.render("hostViews/Add_Edit_home.ejs",{pageTitle:"AddhomePage",editing:true,homeData:home,isLogedIn: req.session.isLogedIn, user: req.session.user})
    }
  } catch (error) {
    console.log(error);
  }

  
})

exports.posthandleEdithomeC=( (req,res,next)=>{
    const {homeid,home,location,price,rating} = req.body;
    
    Home.findById(homeid).then( (airhari)=>{
      if(!airhari){
       console.log("home not found");
       res.redirect("/host/host-homelist")
      }
      airhari.home=home;
      airhari.location=location;
      airhari.price=price;
      airhari.rating=rating;
      // airhari.image=image;
      if (req.file) {
        deleteFile(path.join("public",airhari.image))
        airhari.image = path.join("\\uploads",req.file.filename); ;
      }
      return airhari.save()
    }).finally( ()=>{
      res.redirect("/host/host-homelist")
    })

})


exports.handleAddhomeC=( (req,res,next)=>{
  const {home,location,price,rating} = req.body
  console.log("hi",req.file);
  
  if (!req.file) {
    return res.status(400).send("no valid image provide")
  }
  if(req.file.size >100 * 1024){
    return res.status(400).send("File size too large! Maximum allowed is 1 MB.");
  }
  const image =path.join("\\uploads",req.file.filename);
  
  const homeData = new Home({home,location,price,rating,image,host:req.session.user._id});
  homeData.save().then( ()=>{
    res.redirect("/host/host-homelist")
  }).catch( (error)=>{
    console.log("error while saving the home",error);
    res.redirect("/host/add-edit-Home")
    
  })
 
})

exports.hostHomeListC=(async (req,res,next)=>{
  try {
    const homeData =await Home.find({host:req.session.user._id})
    res.render("hostViews/hostHomeList.ejs",{homeData:homeData,pageTitle:"hostHomePage",isLogedIn: req.session.isLogedIn, user: req.session.user})
  } catch (error) {
    console.log("error while fetching homeDatas from database",error.message);
  }
  
})

exports.hostDeleteHomeC=( async (req,res,next)=>{
  const dltId = req.params.deleteId
  const user = await Home.findOne({_id:dltId})
  deleteFile(path.join("public",user.image))
  try {

   await Home.findOneAndDelete({_id:dltId,host:req.session.user._id})
    console.log("successfully Deleted home");
  } catch (error) {
    console.log("error while Deleting the home",err);
  }
  finally{
    res.redirect("/host/host-homelist")
  }
  

})