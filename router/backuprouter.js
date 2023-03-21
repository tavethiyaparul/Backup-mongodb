const express = require("express");
const router = express.Router();
const { manualBackup,pagePassword,manualBackuprestore,frequencyBackup,getmanualBackup,getautoBackup } = require("../controller/backupcontroller");

// create status 
router.route("/login").post(pagePassword);

router.route("/backup").get(manualBackup);

router.route("/restore").post(manualBackuprestore);

router.route("/auto").get(frequencyBackup);

router.route("/all").get(getmanualBackup);

router.route("/allauto").get(getautoBackup);

module.exports = router;