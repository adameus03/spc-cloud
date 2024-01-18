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

module.exports = {
    executeShellCommand: executeShellCommand,
    gitInit: gitInit
};