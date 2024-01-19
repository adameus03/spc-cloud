/**
 * @fileoverview Sharing module.
 * Enables sharing files between users.
 * Only a directory can be shared along with its contents.
 */

const db = require('./database.js');
const shell = require('./shell.js');
const path = require('path');

/**
 * 
 * @param {*} sharer_id 
 * @param {*} dirRelPath Path relative to sharer's main directory
 * @param {*} passKey 
 * @param {*} isReadOnly 
 */
function ShareInfo(sharer_id, dirRelPath, passKey, isReadOnly = true) {
    this.sharer_id = sharer_id;
    //this.sharee_id = sharee_id;
    this.dirRelPath = dirRelPath;
    this.passKey = passKey;
    this.isReadOnly = isReadOnly;
}

/**
 * @brief Creates a symbolic link from a directory in sharer's directory to a directory in sharee's directory
 * @param {*} sharer_id 
 * @param {*} sharee_id 
 * @param {*} dirRelPath 
 */
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
    for (let i = dirRelPathParts.length - 2; i >= 0; i--) {
        symlinkDomain += dirRelPathParts[i];
        symlinkDomain += '.';
    }
    // Append sharer_id and 'shared' to symlinkDomain
    symlinkDomain += `${sharer_id}.shared`;

    console.log(`SYMLINK DOMAIN: ${symlinkDomain}`);

    console.log(`Sharing ${sharerDir} with ${shareeDir}.${symlinkDomain}`);
    return shell.symlink.create(sharerDir, shareeDir, symlinkDomain);
}

/**
 * @brief Enables sharing a directory with another user; stores the share info in the database
 * @param {*} shareInfo Sharing configuration object
 */
function executeShareInfo(shareInfo) {
    //shareDirectory(shareInfo.sharer_id, shareInfo.sharee_id, shareInfo.dirRelPath);
    //store shareInfo in database
    console.log(`Storing share info in database: ${JSON.stringify(shareInfo)}`);
    return db.ShareInfo.create({
        sharer_id: shareInfo.sharer_id,
        //sharee_id: shareInfo.sharee_id,
        dirRelPath: shareInfo.dirRelPath.toString(),
        passKey: shareInfo.passKey.toString(),
        isReadOnly: shareInfo.isReadOnly.toString() == "true"
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
        /*db.ShareInfo.findOne({
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
        });*/
        // Get dirRelPath format from dirAbsPat format (reverse order joined by dots)
        let dirRelPath = '';
        let dirAbsPathParts = dirAbsPath.split('.');
        for (let i = dirAbsPathParts.length - 2; i >= 0; i--) {
            dirRelPath += dirAbsPathParts[i];
            dirRelPath += '/';
        }
        console.log(`Checking permission for ${sharee_id} to access ${dirRelPath}`);
        // Check if sharee has an ActiveShare 
        // Join ActiveShare and ShareInfo tables on share_id
        ShareInfo.findAll({
            include: { model: ActiveShare, required: true },
        }).then((shareInfo_activeShare_join) => {
            console.log(shareInfo_activeShare_join); 
            /**
             * @todo Check if sharee has an ActiveShare
             * @todo Implement
             */   
        });
          
    });
    
}

module.exports = {
    ShareInfo: ShareInfo,
    executeShareInfo: executeShareInfo,
    checkPermission: checkPermission,
    shareDirectory: shareDirectory,
    SHARE_READ_PERMISSION: SHARE_READ_PERMISSION,
    SHARE_WRITE_PERMISSION: SHARE_WRITE_PERMISSION
}

