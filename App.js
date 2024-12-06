const ENV = process.env.NODE_ENV || "development"
require("dotenv").config({
  path:`.env.${ENV}`
})

const express = require("express")
const bodyPerser = require("body-parser")
const fs = require("fs")
const multer = require("multer")
const helmet = require("helmet")
const morgan = require("morgan")
const compression = require("compression")
const { GlobalRoute } = require("./routers/globalRouter")
const { hostRoute } = require("./routers/hostRouter")
const { customerRoute } = require("./routers/customerRouter")
const mongoose = require("mongoose")
const { authRoute } = require("./routers/authRouter")
const session = require("express-session")
const MongoDB_session = require("connect-mongodb-session")
const path = require("path")

const mongoDbStore = MongoDB_session(session)
const mongo_url = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.9gu54.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`

const sessionStore = new mongoDbStore({
  uri:mongo_url,
  collection:"sessions"
})

const storage = multer.diskStorage({
  destination:"public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,Date.now()+ "_" + file.originalname)
  }
})


const fileFilter = (req,file,cb)=>{
  const isValid = ["image/png","image/jpg","image/jpeg"].includes(file.mimetype)
  cb(null,isValid)
}

const loggongStream = fs.createWriteStream(path.resolve("access.log"),{flags:"a"})

const app = express()
app.use(morgan("combined",{stream:loggongStream}))
app.use(helmet())
app.use(compression())
app.use(bodyPerser.urlencoded({extended:true}))
app.use(express.static(path.resolve("public")))
app.set('view engine', 'ejs');
app.use(multer({storage:storage,fileFilter:fileFilter}).single('image'))


app.use(session({
  secret:"MY AIRBNB",
  resave:false,
  saveUninitialized:true,
  store:sessionStore,
}))

app.use("/host", (req,res,next)=>{
  if (!req.session.isLogedIn) {
    return res.redirect("/login")
  }
  next()
});


app.use(GlobalRoute)
app.use("/host",hostRoute)
app.use("/customer",customerRoute)
app.use(authRoute)


app.use( (req,res,next)=>{
  req.statusCode=404;
  res.render("error.ejs",{pageTitle:"errorPage",isLogedIn:req.session.isLogedIn})
})

const PORT = process.env.PORT || 3000

mongoose.connect(mongo_url).then( ()=>{
  app.listen(PORT, ()=>{
    console.log(`my airbnb server http://localhost:${PORT}`);
    
  })
})
