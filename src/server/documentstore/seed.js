var fs = require('fs');
var path = require('path');

function setUpTestDocs() {
    fs.writeFileSync(path.join(__dirname + '/testDocOne_1.txt'), 'Content for test doc one');
    fs.writeFileSync(path.join(__dirname + '/testDocOne_2.txt'), 'Content for test doc one revision 2');
    fs.writeFileSync(path.join(__dirname + '/testDocTwo_1.txt'), 'Content for test doc two');
}

function clearFileStore() {
    let files = fs.readdirSync(__dirname);
    files.filter(file => {
        return file.includes('.txt');
    }).map(file => {
        return fs.unlinkSync(path.join(__dirname + '/' + file));
    });
}

module.exports = {
    setUpTestDocs,
    clearFileStore
};