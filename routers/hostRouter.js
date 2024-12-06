const express = require("express");
const { addhomeC, handleAddhomeC, hostHomeListC, handleEdithomeC, posthandleEdithomeC, hostDeleteHomeC } = require("../controllers/hostController");

const hostRoute = express.Router()


hostRoute.get("/add-edit-Home",addhomeC)
hostRoute.post("/add-edit-Home",handleAddhomeC)

hostRoute.get("/home/edit/:editId",handleEdithomeC)
hostRoute.post("/home/edit",posthandleEdithomeC)

hostRoute.get("/host-homelist",hostHomeListC)
hostRoute.post("/home/delete/:deleteId",hostDeleteHomeC)


exports.hostRoute=hostRoute;