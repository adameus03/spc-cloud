const express = require('express');
const versionControlAPI = require("../shell.js").versionControlAPI;
const db = require('../database.js');
const dir_utils = require("../dir_utils.js");

const router = express.Router();

router.get('/get-logs', (req, res, next) => {
	//const loginInstance = await db.LoginInstance.findByPk(req.cookies["login_id"]);
	//const commits = (await shell.executeShellCommand(`cd ${process.env.USRFILES_LOCATION}/${loginInstance.user_id} && git log --oneline`)).split("\n");
	//commits.pop(); // every line from git is newline terminated, meaning that there always is one empty entry at the end. This removes that empty line
	//const commitObjects = commits.map(c => c.split(" ")).map(c => { return { hash: c.shift(), msg: c.join(" ") } });
    db.LoginInstance.findByPk(req.cookies["login_id"]).then((loginInstance) => {
        versionControlAPI.getCommits(`${process.env.USRFILES_LOCATION}/${loginInstance.user_id}`).then((commits) => {
            res.render("log-manager", { commits: commits });
        }).catch((err) => {
            console.log(`Version control API error: ${err}`);
        });
    }).catch((err) => {
        console.log(`Error while seeking LoginInstance: ${err}`);
    });
});

router.get("/revert/:commit", async (req, res, next) => {
	//const loginInstance = await db.LoginInstance.findByPk(req.cookies["login_id"]);
	//await shell.executeShellCommand(`cd ${process.env.USRFILES_LOCATION}/${loginInstance.user_id} && git checkout ${req.params.commit}`);
	//res.redirect("/list-gui");
    db.LoginInstance.findByPk(req.cookies["login_id"]).then((loginInstance) => {
        versionControlAPI.moveToCommit(`${process.env.USRFILES_LOCATION}/${loginInstance.user_id}`, req.params.commit).then(() => {
            res.redirect("/list-gui");
        }).catch((err) => {
            console.log(`Version control API error: ${err}`);
        });
    }).catch((err) => {
        console.log(`Error while seeking LoginInstance: ${err}`);
    });
});

module.exports = router;