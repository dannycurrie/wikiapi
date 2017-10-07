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
            return file.substring(file.lastIndexOf('_')).replace('_', '').replace('.txt', '');
        });
        
        callback(error, revNos);
    });
}

module.exports = {
    getTitles,
    getRevisions
};