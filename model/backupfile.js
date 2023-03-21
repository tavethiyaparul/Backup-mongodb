const mongoose = require("mongoose");

const backupfileSchema = new mongoose.Schema({
 path:{
    type:String,
    require:true
 },
 fileName:{
    type:String,
 }
});

module.exports = mongoose.model("backupfile", backupfileSchema);