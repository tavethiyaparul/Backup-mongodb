
const { spawn } = require('child_process');
const path = require('path');
const cron = require('node-cron');
const backupfile=require("../model/backupfile")
const autobackupfile=require("../model/autobackupfile")
require("../connect")
/* 
Basic mongo dump and restore commands, they contain more options you can have a look at man page for both of them.
1. mongodump --db=rbac_tutorial --archive=./rbac.gzip --gzip
2. mongorestore --db=rbac_tutorial --archive=./rbac.gzip --gzip

Using mongodump - without any args:
  will dump each and every db into a folder called "dump" in the directory from where it was executed.
Using mongorestore - without any args:
  will try to restore every database from "dump" folder in current directory, if "dump" folder does not exist then it will simply fail.
*/


const DB_NAME = process.env.MONGO_DB
// const ARCHIVE_PATH = path.join(__dirname, '../public', `${DB_NAME}.gzip`);
// console.log("ARCHIVE_PATH",ARCHIVE_PATH)

// 1. Cron expression for every 5 seconds - */5 * * * * *
// 2. Cron expression for every night at 00:00 hours (0 0 * * * )
// Note: 2nd expression only contains 5 fields, since seconds is not necessary

// Scheduling the backup every 5 seconds (using node-cron)
// cron.schedule('*/5 * * * * *', () => backupMongoDB());
// backupMongoDB();

const fs = require('fs'); 
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
});

// const fileName = `./public/${process.env.MONGO_DB}.gzip`

const uploadFile = (fileName,dateTime,str) => {
  fs.readFile(fileName,(err, data) => {
    console.log("data",data)
     if (err) throw err;
     const params = {
         Bucket: process.env.AWS_S3_BUCKET_NAME, // pass your bucket name
         Key: `unsecure/mongodb_backup/${process.env.MONGO_DB}_${dateTime}.gzip`, // file will be saved as testBucket/contacts.csv
         Body: JSON.stringify(data, null, 2)
     };
     s3.upload(params, function(s3Err, data) {
         if (s3Err) throw s3Err
    
      
    if(str === "autobackupfile"){
      console.log("auto")
      const res =  autobackupfile.create({
        path:data.Location,
        fileName:`${process.env.MONGO_DB}_${dateTime}`
      })
      console.log("res",res)

    }else{
      console.log("manual")
      const res =  backupfile.create({
        path:data.Location,
        fileName:`${process.env.MONGO_DB}_${dateTime}`
      })
      console.log("res",res)
    }
         console.log(`File uploaded successfully at ${data.Location}`)
         return data.Location
     });
  });
};

// const filePath = `./download/${process.env.MONGO_DB}.gzip`

const downloadFile = (filePath,file) => {
  console.log("download....")
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${file}.gzip`
  };
  s3.getObject(params, (err, data) => {
    if (err) console.error(err);
    fs.writeFileSync(filePath,JSON.stringify(data, null, 2));
    console.log(`${filePath} has been created!`);
  });
};

// uploadFile();
function backupMongoDB(ARCHIVE_PATH,dateTime,str) {
  const child = spawn('mongodump', [
    `--uri=${process.env.MONGO_URL}`,
    `--archive=${ARCHIVE_PATH}`,
    '--gzip',
  ]);
  //  console.log("child",child)

  child.stdout.on('data', (data) => {
    console.log('stdout:\n', data);
  });
  child.stderr.on('data', (data) => {
    console.log('stderr:\n', Buffer.from(data).toString());
  });
  child.on('error', (error) => {
    console.log('error:\n', error);
  });
  child.on('exit', (code, signal) => {
    if (code) console.log('Process exit with code:', code);
    else if (signal) console.log('Process killed with signal:', signal);
    else {console.log('Backup is successfull ✅');
    const fileName = `./public/${process.env.MONGO_DB}_${dateTime}.gzip`
     uploadFile(fileName,dateTime,str)   
  }
  });
}

//backup restore 
async function backupRestoreMongoDB(ARCHIVE_PATH) {
  const child = spawn('mongorestore', [
     `--uri=${process.env.RESTORE_URL}`,
    `--archive=${ARCHIVE_PATH}`,
    '--gzip',
    `--drop`,
  ]);
  //  console.log("child",child)

  child.stdout.on('data', (data) => {
    console.log('stdout:\n', data);
  });
  child.stderr.on('data', (data) => {
    console.log('stderr:\n', Buffer.from(data).toString());
  });
  child.on('error', (error) => {
    console.log('error:\n', error);
  });
  child.on('exit', (code, signal) => {
    if (code) console.log('Process exit with code:', code);
    else if (signal) console.log('Process killed with signal:', signal);
    else {console.log('Backup restore is successfull ✅'); 
  }
  });
}

//manual backup
exports.manualBackup = (req,res)=>{
  const dateTime =Date.now()
  const ARCHIVE_PATH = path.join(__dirname, '../public', `${DB_NAME}_${dateTime}.gzip`);
  console.log("ARCHIVE_PATH",ARCHIVE_PATH)
  // const fileName = `./public/${process.env.MONGO_DB}_${Date.now()}.gzip` 
   backupMongoDB(ARCHIVE_PATH,dateTime,str="backupfile")
  // uploadFile()
  res.send("backup successfully")
}

//get manual backup file
exports.getmanualBackup = async(req,res)=>{
  const data= await backupfile.find()
  res.send(data)
}

//get auto backup file
exports.getautoBackup = async(req,res)=>{
  const data= await autobackupfile.find()
  res.send(data)
}

//manual backup
exports.manualBackuprestore = async (req,res)=>{
  const file = req.body.fileName
  console.log("restore data",file)

  // const filePath = `./download/${file}.gzip`
  // downloadFile(filePath,file)

  const ARCHIVE_PATH = path.join(__dirname, '../public',`${file}.gzip`);
  console.log("ARCHIVE_PATH",ARCHIVE_PATH)

  
  await backupRestoreMongoDB(ARCHIVE_PATH)
  res.send("backup restore successfully")
}

//auto backup
exports.frequencyBackup = async (req,res)=>{
  const day=process.env.BACKUP_FREQUENCY_DAYS
  // const dateTime =Date.now()
  // const ARCHIVE_PATH = path.join(__dirname, '../public', `${DB_NAME}_${dateTime}.gzip`);
  // console.log("ARCHIVE_PATH",ARCHIVE_PATH)
  cron.schedule('*/5 * * * * *', () => backupMongoDB(path.join(__dirname, '../public', `${DB_NAME}_${Date.now()}.gzip`),Date.now(),str="autobackupfile"));
  // cron.schedule(`0 ${day} * * * *`, () => backupMongoDB());
  // backupRestoreMongoDB()
  // backupMongoDB()
  // uploadFile()
  res.send("backup successfully")
}

// Login api 
exports.pagePassword = async (req,res)=>{
  const password=req.body.password
  if(password == process.env.DB_BACKUP_PAGE_PASSWORD){
   return res.status(200).send("login successfully")
  }
  return res.status(200).send("Invalid Password")
}
