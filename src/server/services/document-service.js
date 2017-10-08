const fs = require('fs');
const path = require('path');

function getTitles (callback) {
    
    // read store
    fs.readdir('src/server/documentstore', (error, files) => {
        if(error)
            throw error;

        let uniqueTitles = [];

        uniqueTitles = files.filter(file => {
            // only text files
            return file.includes('.txt');
        }).map(file => {
            // strip revision and file ext
            return file.substring(0, file.lastIndexOf('_'));
        }).filter((file, pos, self) => {
            // return only unique titles
            return self.indexOf(file) === pos;
        });

        callback(error, uniqueTitles);
    });
}

function getRevisions (title, callback) {
    // return all which match the title
    fs.readdir('src/server/documentstore', (error, files) => {
         if (error)
            throw error;

        let revNos = [];

        revNos = files.filter(file => {
            // return files matching title
            return file.substring(0, file.lastIndexOf('_')) === title;
        }).map(file => {
            // extract the revision number
            return file.substring(file.lastIndexOf('_'))
                                        .replace('_', '')
                                        .replace('.txt', '');
        });
        
        callback(error, revNos);
    });
}

function getRevisionByDatetime(title, timestamp, callback) {

    const requestedDate = new Date(timestamp);

    console.log('request date ' + requestedDate.toString());

    if(!requestedDate) {
        throw {
            type: 'type error',
            message: 'timestamp was not in a recogisable format: ' + timestamp
        };
    }

    fs.readdir('src/server/documentstore', (error, files) => {

        let revisionToRtn;

        // get all revisions of this document
        let allRevisions = files.filter(file => {
            // return files matching title
            return file.substring(0, file.lastIndexOf('_')) === title;
        }).sort();

        // using a for loop so we can break at the right time
        for (let i = 0; i < allRevisions.length; i++) {

            let revision = allRevisions[i];

            let fileStats = fs.statSync('src/server/documentstore/' + revision);
            
            console.log('revision date ' + fileStats.mtime.toString());

            if(fileStats.mtime <= requestedDate){
                revisionToRtn = revision;
                console.log('setting revision: ' + revisionToRtn);
            }
            else{
                console.log('returing revision: ' + revisionToRtn);
                break;
            }
        }

        let document;

        if (revisionToRtn) {
            // contruct document to return
            let revisionNo = revisionToRtn.substring(revisionToRtn.lastIndexOf('_') + 1)
                                        .replace('.txt', '');
            let content = fs.readFileSync('src/server/documentstore/' + revisionToRtn, 'utf8');

            document = {
                title: title,
                revision: revisionNo,
                content: content
            };

        } else {
            error = {
                type: 'no results',
                message: 'there is no available revision for the date : ' + requestedDate.toString()
            };
        }

        callback(error, document);
    });
}

function getLatestDocumentByTitle(title, callback) {

    let document;

    // get all revisions
    fs.readdir('src/server/documentstore', (error, files) => {

        // filter by title
        let revisions = files.filter(file => {
            return file.substring(0, file.lastIndexOf('_')) === title;
        }).sort(); 

        if(revisions.length === 0) {
            error = {
                type: 'no result',
                message: 'no documents found with title: ' + title 
            };
        } else {

            const lastestRev = revisions[revisions.length - 1];

            // construct document
            let revisionNo = lastestRev.substring(lastestRev.lastIndexOf('_') + 1)
                                            .replace('.txt', '');
            let content = fs.readFileSync('src/server/documentstore/' + lastestRev, 'utf8');

            document = {
                title: title,
                revision: revisionNo,
                content: content
            };
        }

        callback(error, document);
    });
}

function updateDocument(title, content, callback) {
    // get current revisions

    let document;

    fs.readdir('src/server/documentstore', (error, files) => {

        if(!error) {

            // filter files to only this document's revisions
            files = files.filter(file => {
                return file.substring(0, file.lastIndexOf('_')) === title;
            });

            // create title of new file with revision number
            const revNo = files.length + 1;
            const newFilename = title + '_' + revNo + '.txt';

            // write file
            fs.writeFileSync('src/server/documentstore/' + newFilename, content, 'utf-8');

            // construct document to return
            document = {
                title: title,
                revision: revNo.toString(),
                content: content
            };
        }

        callback(error, document);
    });
}

module.exports = {
    getTitles,
    getRevisions,
    getRevisionByDatetime,
    getLatestDocumentByTitle,
    updateDocument
};