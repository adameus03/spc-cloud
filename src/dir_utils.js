const fs = require('fs');
const path = require('path');

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
}

function getFileList(user_id) {
    return fs.readdirSync(`${process.env.USRFILES_LOCATION}/${user_id}`).map((fname) => {
        return {
            name: fname,
            //size: fs.lstatSync(`${process.env.USRFILES_LOCATION}/${user_id}/${fname}`).size,
            size: getHumanReadableFileSize(`${process.env.USRFILES_LOCATION}/${user_id}/${fname}`),
            isDir: fs.lstatSync(`${process.env.USRFILES_LOCATION}/${user_id}/${fname}`).isDirectory()
        }
    });
}

module.exports = {
	createUserDirectory : createUserDirectory,
    getFileList : getFileList
}