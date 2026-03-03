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
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            comments = getAllComments();
            debugger;
            for (const comment of comments) {
                console.log(comment);
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