
process.env.NODE_ENV = 'test';

var fs = require('fs');
var path = require('path');

function setUpTestDocs() {
    // we will set up 2 documents, one of which has 2 revisions spanning 2 days
    fs.writeFileSync(path.join(__dirname + '/testDocOne_1.txt'), 'Content for test doc one');
    fs.utimesSync(path.join(__dirname + '/testDocOne_1.txt'),
            new Date('2017-10-05T00:00:00Z'),
            new Date('2017-10-05T00:00:00Z'));
    fs.writeFileSync(path.join(__dirname + '/testDocOne_2.txt'), 'Content for test doc one revision 2');
    fs.utimesSync(path.join(__dirname + '/testDocOne_2.txt'),
            new Date('2017-10-07T00:00:00Z'),
            new Date('2017-10-07T00:00:00Z'));
    fs.writeFileSync(path.join(__dirname + '/testDocTwo_1.txt'), 'Content for test doc two');
}

function clearFileStore() {
    let files = fs.readdirSync(__dirname);
    files.filter((file) => {
        return file.includes('.txt');
    }).map((file) => {
        return fs.unlinkSync(path.join(__dirname + '/' + file));
    });
}

module.exports = {
    setUpTestDocs,
    clearFileStore
};