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
        case 'sort':
            switch (com[1]) {
                case 'importance':
                    const impComp = sortCommentsByImportance(comments);
                    for (const comment of impComp) {
                        console.log(comment)
                    }
                    break
                case 'user':
                    sortCommentsByUsers(comments);
                    break
                case 'date':
                    const sBD = sortCommentsByDate(comments);
                    for (const comment of sBD) {
                        console.log(comment)
                    }
                    break
                default:
                    console.log('wrong command')
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

function sortCommentsByImportance(comments) {
    const pairs = []
    for (const comment of comments) {
        const count = [...comment].filter(s => s === '!').length;
        pairs.push([count, comment]);
    }
    return pairs.sort((a, b) => b[0] - a[0]).map(p => p[1]);
}

function sortCommentsByUsers(comments) {
    const userDict = new Map();
    userDict.set('zzzzz', [])
    for (const comment of comments) {
        const parts = comment.split(';');
        if (parts.length !== 3) {
            userDict.get('zzzzz').push(comment);
            continue;
        }
        const name = parts[0].split(' ')[2].toLowerCase();
        if (!userDict.has(name)) {
            userDict.set(name, []);
        }
        userDict.get(name).push(comment);
    }
    for (const user of userDict.keys()) {
        if (user === 'zzzzz') {
            continue;
        }
        for (const comment of userDict.get(user)) {
            console.log(comment)
        }
    }
    for (const comment of userDict.get('zzzzz')) {
        console.log(comment)
    }
}

function sortCommentsByDate(comments) {
    const userDict = new Map();
    userDict.set('NO_DATE', []);

    for (const comment of comments) {
        const parts = comment.split(';');

        if (parts.length !== 3) {
            userDict.get('NO_DATE').push(comment);
            continue;
        }

        const dateStr = parts[1].trim();
        const date = new Date(dateStr);

        if (isNaN(date)) {
            userDict.get('NO_DATE').push(comment);
            continue;
        }

        if (!userDict.has(dateStr)) {
            userDict.set(dateStr, []);
        }

        userDict.get(dateStr).push(comment);
    }

    return [
        ...[...userDict.entries()]
        .filter(([date]) => date !== 'NO_DATE')
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([_, comments]) => comments)
        .flat(),
        ...userDict.get('NO_DATE')
    ];
}

// TODO you can do it!