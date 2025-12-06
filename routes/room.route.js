const router=require("express").Router();
const roomController=require("../controllers/roomApi.controller");

router.post("/",roomController.create);

module.exports=router;