const fs = require('fs');
const path = require('path');
const shell = require('./shell.js');


function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}

/**
 * @proposition Move to client-side?
 */
function getHumanReadableFileSize(filename) {
    var bytes = getFilesizeInBytes(filename);
    var units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
    var i = 0;
    while (bytes >= 1024) {
        bytes /= 1024;
        i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
}

function createUserDirectory(user_id) {
    console.log(`Executing mkdir ${process.env.USRFILES_LOCATION}/${user_id}`);
    fs.mkdirSync(`${process.env.USRFILES_LOCATION}/${user_id}`);
    shell.gitInit(`${process.env.USRFILES_LOCATION}/${user_id}`);
}

function getFileList(user_id, d='') {
    //check if dir exists
    if (!fs.existsSync(`${process.env.USRFILES_LOCATION}/${user_id}${d}`)) {
        console.log(`User #${user_id} tried to access non-existing directory ${process.env.USRFILES_LOCATION}/${user_id}/${d}!!!`);
        return [];
    }
    return fs.readdirSync(`${process.env.USRFILES_LOCATION}/${user_id}${d}`).map((fname) => {
        return {
            name: fname,
            //size: fs.lstatSync(`${process.env.USRFILES_LOCATION}/${user_id}/${fname}`).size,
            size: getHumanReadableFileSize(`${process.env.USRFILES_LOCATION}/${user_id}${d}/${fname}`),
            isDir: fs.lstatSync(`${process.env.USRFILES_LOCATION}/${user_id}${d}/${fname}`).isDirectory()
        }
    });
}

module.exports = {
	createUserDirectory : createUserDirectory,
    getFileList : getFileList
}