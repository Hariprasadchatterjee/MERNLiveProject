const express = require("express");
const { gethomeC, getdetailsC,postFavouriteC,getFavouriteC,postDeleteFavouriteC, getRulesC } = require("../controllers/customerController");
const customerRoute = express.Router()


customerRoute.get("/Home",gethomeC)
customerRoute.get("/details/:homeId",getdetailsC)
customerRoute.post("/favourite",postFavouriteC)
customerRoute.post("/favourite/delete/:deleteId",postDeleteFavouriteC)
customerRoute.get("/favourite",getFavouriteC)
customerRoute.get("/rules/:houseId",getRulesC)


exports.customerRoute=customerRoute;