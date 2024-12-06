const express = require("express");
const GlobalRoute = express.Router()
const { indexC } = require("../controllers/GlobalController");

GlobalRoute.get("/",indexC)


exports.GlobalRoute=GlobalRoute;