const fs = require('fs');
const path = require('path');

const docStorePath = 'src/server/documentstore/';

function getTitles (callback) {
    // read store
    fs.readdir(docStorePath, (error, files) => {
        if(error){
            throw error;
        }

        let uniqueTitles = [];

        uniqueTitles = files.filter((file) => {
            // only text files
            return file.includes('.txt');
        }).map((file) => {
            // strip revision and file ext
            return extractDocTitleFromFilename(file);
        }).filter((file, pos, self) => {
            // return only unique titles
            return self.indexOf(file) === pos;
        });

        callback(error, uniqueTitles);
    });
}

function getRevisions (title, callback) {
    // return all which match the title
    fs.readdir(docStorePath, (error, files) => {
         if (error) {
            throw error;
         }

        let revNos = [];

        revNos = filterFilesByTitle(title, files)
            .map((file) => {
            // extract the revision number
            return extractRevisionNumber(file);
        });
        callback(error, revNos);
    });
}

function getRevisionByDatetime(title, timestamp, callback) {

    const requestedDate = getDateFromTimestamp(timestamp);

    if(!requestedDate) {
        throw {
            type: 'type error',
            message: 'timestamp was not in a recogisable format: ' + timestamp
        };
    }

    fs.readdir(docStorePath, (error, files) => {

        let revisionToRtn;
        // get all revisions of this document
        let allRevisions = filterFilesByTitle(title, files).sort();

        // using a for loop so we can break at the right time
        for (let i = 0; i < allRevisions.length; i++) {

            let revision = allRevisions[i];
            let fileStats = fs.statSync(docStorePath + revision);

            if(fileStats.mtime <= requestedDate){
                revisionToRtn = revision;
            }
            else{
                break;
            }
        }

        let document;

        if (revisionToRtn) {
            // contruct document to return
            let revisionNo = extractRevisionNumber(revisionToRtn);
            let content = fs.readFileSync(docStorePath + revisionToRtn, 'utf8');

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
    fs.readdir(docStorePath, (error, files) => {

        // filter by title
        let revisions = filterFilesByTitle(title, files).sort();

        if(revisions.length === 0) {
            error = {
                type: 'no result',
                message: 'no documents found with title: ' + title
            };
        } else {

            const lastestRev = revisions[revisions.length - 1];

            // construct document
            let revisionNo = extractRevisionNumber(lastestRev);
            let content = fs.readFileSync(docStorePath + lastestRev, 'utf8');

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

// HELPER FUNCTIONS - abstracting away filename details from rest of code

function filterFilesByTitle(title, files) {
    return files.filter(file => {
        return file.substring(0, file.lastIndexOf('_')) === title; 
    });
}

function extractRevisionNumber(file) {
    return file.substring(file.lastIndexOf('_'))
                                        .replace('_', '')
                                        .replace('.txt', '');
}

function extractDocTitleFromFilename(filename) {
    return filename.substring(0, filename.lastIndexOf('_'));
}

// this is a bit of a hack to make sure we account for timezone offset - this is not a long term solution
function getDateFromTimestamp(timestamp) {

    let requestedDate = new Date(timestamp);

    // if the timestamp is invalid, don't continue
    if (!requestedDate) return requestedDate;

    // find offset and correct time
    let offset = requestedDate.getTimezoneOffset();
    requestedDate.setMinutes(requestedDate.getMinutes() + offset);

    return requestedDate;
}

module.exports = {
    getTitles,
    getRevisions,
    getRevisionByDatetime,
    getLatestDocumentByTitle,
    updateDocument
};