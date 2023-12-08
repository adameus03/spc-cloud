const fs = require('fs');
const path = require('path');
function createUserDirectory(user_id) {
    console.log(`Executing mkdir ${process.env.USRFILES_LOCATION}/${user_id}`);
    fs.mkdirSync(`${process.env.USRFILES_LOCATION}/${user_id}`);
}

function getFileList(user_id) {
    return fs.readdirSync(`${process.env.USRFILES_LOCATION}/${user_id}`);
}

module.exports = {
	createUserDirectory : createUserDirectory,
    getFileList : getFileList
}