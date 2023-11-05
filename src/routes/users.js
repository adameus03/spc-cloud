const express = require('express');
const db = require("../database.js");
const utils = require("../utils.js");
const formidable = require('formidable');

const router = express.Router();

router.post("/register", async (req, res, next) => {
	const form = new formidable.IncomingForm();
	const [fields, files] = await form.parse(req); //Modern JavaScript is hell
	if (fields["username"] && fields["username"][0] && fields["password"] && fields["password"][0]) {
		if (!await db.Person.findByPk(fields["username"][0])) {
			db.Person.create({
				username: fields["username"][0],
				password: fields["password"][0],
			});
			res.redirect("/users/login");
		} else {
			res.redirect("/users/register");
			console.log("Trying to create existing user");
		}
	} else {
		res.redirect("/users/register");
		console.log("Register: One of needed fields was missing");
	}
	res.end();
})

router.get("/register", (req, res, next) => {
	res.render("register.html", { title: "Registration" });
})

router.get("/login", (req, res, next) => {
	res.render("login.html", { title: "Registration" });
})

router.post("/login", async (req, res, next) => {
	const form = new formidable.IncomingForm();
	const [fields, files] = await form.parse(req);
	if (fields["username"] && fields["username"][0] && fields["password"] && fields["password"][0]) {
		const user = await db.Person.findByPk(fields["username"][0]);
		if (user) {
			let generatedId;
			do {
				generatedId = utils.makeid(32);
			} while (await db.LoginInstance.findByPk(generatedId));
			await db.LoginInstance.create({
				login_id: generatedId,
				user: user.username,
			});
			res.cookie("login_id", generatedId, {
				maxAge: 86400000 // one day
			});
			res.redirect("/");
		} else {
			res.redirect("/users/register");
			console.log("Trying to create existing user");
		}
	} else {
		res.redirect("/users/login");
		console.log("Login: One of needed fields was missing");
	}
	res.end();
})

router.get("/", async (req, res, next) => {
	res.type = "application/json";
	res.write(JSON.stringify(await db.Person.findAll()));
	res.statusCode = 200;
	res.end();
})

module.exports = router;