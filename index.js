require("dotenv").config()
const express = require("express")
const app = express()
const cors = require('cors')
const path = require("path")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*" }))
app.use("/",require("./router/backuprouter"))

app.use(express.static(path.join(__dirname, "frontend/build")))

app.use("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"frontend/build","index.html"));
})

app.listen(5000,(req,res)=>{
  console.log("server starting port 5000")
})
