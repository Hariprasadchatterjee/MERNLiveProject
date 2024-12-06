// const {MongoClient} = require("mongodb")

// const url ="mongodb+srv://harichatterjee957:java@cluster0.9gu54.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// let _db;
// const mongoConnect=(callback)=>{

//   MongoClient.connect(url).then( (client)=>{
//     callback(client)
//     _db=client.db("airhari")
//   }).catch( (error)=>{
//     console.log("error while connecting mongo db",error);
    
//   })
// }

// const dataBbase = ()=>{
//   if (!_db) {
//     throw new Error("database not found")
//   }
//   else{
//     return _db
//   }
// }

// exports.mongoConnect=mongoConnect
// exports.dataBbase=dataBbase