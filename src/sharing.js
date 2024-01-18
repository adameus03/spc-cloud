/**
 * @fileoverview Sharing module.
 * Enables sharing files between users.
 * Only a directory can be shared along with its contents.
 */

const db = require('./db.js');
const shell = require('./shell.js');
const path = require('path');

/**
 * 
 * @param {*} sharer_id 
 * @param {*} sharee_id 
 * @param {*} dirRelPath Path relative to sharer's main directory
 * @param {*} passKey 
 * @param {*} isReadOnly 
 */
function ShareInfo(sharer_id, sharee_id, dirRelPath, passKey, isReadOnly = true) {
    this.sharer_id = sharer_id;
    this.sharee_id = sharee_id;
    this.dirRelPath = dirRelPath;
    this.passKey = passKey;
    this.isReadOnly = isReadOnly;
}

function shareDirectory(sharer_id, sharee_id, dirRelPath) {
    if (dirRelPath.startsWith('/')) {
        dirRelPath = dirRelPath.substr(1);
    }
    let sharerDir = `${process.env.USRFILES_LOCATION}/${sharer_id}/${dirRelPath}`;
    let dirName = path.basename(dirRelPath);
    let shareeDir = `${process.env.USRFILES_LOCATION}/${sharee_id}/${dirName}`;
    
    let symlinkDomain = '';
    // Put subdirectories of the dirRelPath in reverse order separated by dots into symlinkDomain
    let dirRelPathParts = dirRelPath.split('/');
    for (let i = dirRelPathParts.length - 1; i >= 0; i--) {
        symlinkDomain += dirRelPathParts[i];
        symlinkDomain += '.';
    }
    // Append sharer_id and 'shared' to symlinkDomain
    symlinkDomain += `${sharer_id}.shared`;

    shell.symlink.create(sharerDir, shareeDir, symlinkDomain);

    console.log(`Sharing ${sharerDir} with ${shareeDir}.${symlinkDomain}`);
}

/**
 * @brief Executes sharing of a directory.
 * @param {*} shareInfo Sharing configuration object
 */
function executeShareInfo(shareInfo) {
    shareDirectory(shareInfo.sharer_id, shareInfo.sharee_id, shareInfo.dirRelPath);
    //store shareInfo in database
    db.ShareInfo.create({
        sharer_id: shareInfo.sharer_id,
        sharee_id: shareInfo.sharee_id,
        dirRelPath: shareInfo.dirRelPath,
        passKey: shareInfo.passKey,
        isReadOnly: shareInfo.isReadOnly
    });
}

const SHARE_READ_PERMISSION = 1;
const SHARE_WRITE_PERMISSION = 0;

/**
 * 
 * @param {*} sharee_id Id of the user that wants to access the directory
 * @param {*} dirPath Path relative to sharee main directory
 * Its format is: sharedDirectoryBaseName.dir1.dir2.dir3...dirN.sharer_id.shared
 * @param {*} permission SHARE_READ_PERMISSION or SHARE_WRITE_PERMISSION for checking read or write permission respectively
 * @returns Promise that resolves with true if the sharee has the permission to access the directory, false otherwise
 */
function checkPermission(sharee_id, dirAbsPath, permission) {
    return new Promise((resolve, reject) => {
        db.ShareInfo.findOne({
            where: {
                sharee_id: sharee_id,
                dirRelPath: dirRelPath
            }
        }).then((shareInfo) => {
            if (shareInfo) {
                if (permission == SHARE_READ_PERMISSION) {
                    return true;
                } else if (permission == SHARE_WRITE_PERMISSION) {
                    resolve(!shareInfo.isReadOnly);
                }
            } else {
                resolve(false);
            }
        }).reject((err) => {
            reject(err);
        });
    });
    
}

module.exports = {
    ShareInfo: ShareInfo,
    executeShareInfo: executeShareInfo,
    checkPermission: checkPermission
}

