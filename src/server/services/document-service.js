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

module.exports = {
    getTitles
};