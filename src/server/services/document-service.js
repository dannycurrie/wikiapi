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

        if(revisionToRtn){
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
            }
        }

        callback(error, document);
    });
}

module.exports = {
    getTitles,
    getRevisions,
    getRevisionByDatetime
};