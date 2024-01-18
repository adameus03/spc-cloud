var express = require('express');
//import Flmngr from "flmngr";
//var Flmngr = require("flmngr");

var router = express.Router();

router.get('/', function(req, res, next) {
    /*Flmngr.open({
        apiKey: "FLMNFLMN", // default free key
        urlFileManager: '/flmngr',
        urlFiles: '/files',
        isMultiple: true,
        onFinish: (files) => {
            console.log("User picked:");
            console.log(files);
        }
    });*/
});

module.exports = router;