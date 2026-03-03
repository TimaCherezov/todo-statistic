const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    const com = command.split(' ');
    const comments = getAllComments();
    switch (com[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const comment of comments) {
                console.log(comment);
            }
            break;
        case 'important':
            for (const comment of comments) {
                if (comment.indexOf('!') !== -1) {
                    console.log(comment);
                }
            }
            break;
        case 'user':
            const userName = com[1].toLowerCase();
            for (const comment of comments) {
                if (comment.toLowerCase().indexOf(userName) !== -1) {
                    console.log(comment);
                }
            }
            break;

        default:
            console.log('wrong command');
            break;
    }
}

function getAllComments() {
    const comments = [];
    const files = getFiles();
    for (const fileText of files) {
        const lines = fileText.split('\n');
        for (const line of lines) {
            const startComIndex = line.indexOf('// TODO ')
            if (startComIndex === -1) {
                continue;
            }
            comments.push(line.slice(startComIndex));
        }
    }
    return comments;
}

// TODO you can do it!