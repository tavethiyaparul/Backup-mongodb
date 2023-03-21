const mongoose = require("mongoose");

const autobackupfileSchema = new mongoose.Schema({
 path:{
    type:String,
    require:true
 },
 fileName:{
    type:String,
 }
});

module.exports = mongoose.model("autobackupfile", autobackupfileSchema)