const { exec } = require("child_process");

function executeShellCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing shell command ${command}: ${error}`);
                reject(error);
            }
            else {
                resolve(stdout);
            }
        });
    });
}

function gitInit(pwd) {
    return executeShellCommand(`git init ${pwd}`);
}

function gitCommitFileUpload(pwd, fnames, areReplaces) {
    //return executeShellCommand(`git add ${totalPath} && git commit -m "${isReplace ? 'Changed contents of ' : 'Uploaded'} ${fname}"`);
    let commitMessage = '';
    for (let i = 0; i < fnames.length - 1; i++) {
        commitMessage += `${areReplaces[i] ? 'Changed contents of ' : 'Uploaded'} ${fnames[i]}, `;
    }
    commitMessage += `${areReplaces[fnames.length - 1] ? 'Changed contents of ' : 'Uploaded'} ${fnames[fnames.length - 1]}`;
    return executeShellCommand(`cd ${pwd} && git add --all && git commit -m "${commitMessage}"`);
}

function gitCommitIncompleteFileUpload(pwd) {
    // this is beautiful
    return executeShellCommand(`cd ${pwd} && git reset --hard`);   
}

function gitCommitFileDelete(pwd, totalPath, fname) {
    //return executeShellCommand(`git rm ${totalPath} && git commit -m "Deleted file: ${fname}"`);
    //return executeShellCommand(`cd ${pwd} && rm ${totalPath} && git commit -m "Deleted file: ${fname}"`);
    return executeShellCommand(`cd ${pwd} && git add --all && git commit -m "Deleted file: ${fname}"`);
}

function gitCommitDirDelete(pwd, totalPath, fname) {
    //return executeShellCommand(`cd ${pwd} && rm -rf ${totalPath} && git commit -m "Deleted whole directory: ${fname}"`);
    return executeShellCommand(`cd ${pwd} && git add --all && git commit -m "Deleted whole directory: ${fname}"`);
}

/**
 * 
 * @param {*} pwd User storage directory path
 * @param {*} commitHash Hash of the commit to move to
 * @returns a Promise that resolves when the command is executed
 */
function gitMoveToCommit(pwd, commitHash) {
    return executeShellCommand(`cd ${pwd} && git checkout ${commitHash}`);
}

/**
 * 
 * @param {*} pwd User storage directory path
 * @returns Promise that resolves with an array of commit objects in the form { hash, message }
 */
function gitGetCommits(pwd) {
    return new Promise((resolve, reject) => {
        let commits = [];
        // store commits as objects { hash, message }
        executeShellCommand(`cd ${pwd} && git log --pretty=format:"%H,%s"`).then((stdout) => {
            let lines = stdout.split('\n');
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                let hash = line.substr(0, line.indexOf(','));
                let message = line.substr(line.indexOf(',') + 1);
                commits.push({
                    hash: hash,
                    message: message
                });
            }
            resolve(commits);
        }).catch((err) => {
            reject(err);
        });
    });
}




module.exports = {
    executeShellCommand: executeShellCommand,
    gitInit: gitInit,
    gitCommitFileUpload: gitCommitFileUpload,
    gitCommitIncompleteFileUpload: gitCommitIncompleteFileUpload,
    gitCommitFileDelete: gitCommitFileDelete,
    gitCommitDirDelete: gitCommitDirDelete,
    gitMoveToCommit: gitMoveToCommit,
    versionControlAPI: {
        moveToCommit: gitMoveToCommit,
        getCommits: gitGetCommits
    }
};