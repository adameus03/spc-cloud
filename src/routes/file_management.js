const express = require('express');
const shell = require("../shell.js");
const db = require('../database.js');
const dir_utils = require("../dir_utils.js");

const router = express.Router();

router.get('/get-logs', async (req, res, next) => {
	const loginInstance = await db.LoginInstance.findByPk(req.cookies["login_id"]);
	//const commits = (await shell.executeShellCommand(`cd ${process.env.USRFILES_LOCATION}/${loginInstance.user_id} && git log --oneline`)).split("\n");
    const commits = 
	commits.pop(); // every line from git is newline terminated, meaning that there always is one empty entry at the end. This removes that empty line
	const commitObjects = commits.map(c => c.split(" ")).map(c => { return { hash: c.shift(), msg: c.join(" ") } });
	res.render("log-manager", { commits: commitObjects });
});

router.get("/revert/:commit", async (req, res, next) => {
	const loginInstance = await db.LoginInstance.findByPk(req.cookies["login_id"]);
	await shell.executeShellCommand(`cd ${process.env.USRFILES_LOCATION}/${loginInstance.user_id} && git checkout ${req.params.commit}`);
	res.redirect("/list-gui");
});

module.exports = router;