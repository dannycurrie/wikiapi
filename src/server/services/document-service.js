const fs = require('fs');
const path = require('path');

function getTitles (callback) {
    
    // read store
    fs.readdir('src/server/documentstore', (error, files) => {
        if(error)
            throw error;

        files = files.filter(file => {
            return file.includes('.txt');
        }).map(file => {
            return file.replace('.txt', '');
        });

        callback(error, files);
    });
}

module.exports = {
    getTitles
};