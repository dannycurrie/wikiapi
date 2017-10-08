const docService = require('../services/document-service');

// INDEX CONTROLLER - a thin layer to isolate controller and routes login from data access layer

function getAvailableTitles(callback) {
    console.log('requesting all titles');

    docService.getTitles(callback);
}

function getAvailableRevisions(title, callback) {
    console.log('requesting revisions for document: ' + title);

    docService.getRevisions(title, callback);
}

function getLatestDocument(title, callback) {
    console.log('requesting latest version of ' + title);

    docService.getLatestDocumentByTitle(title, callback);
}

function getDocumentAtTime(title, timestamp, callback) {
    console.log('requesting ' + title + ' at ' + timestamp);

    docService.getRevisionByDatetime(title, timestamp, callback);
}

function updateDocument(title, content, callback) {

    console.log('updating ' + title);

    docService.updateDocument(title, content, callback);
}

module.exports = {
    getAvailableTitles,
    getAvailableRevisions,
    getLatestDocument,
    getDocumentAtTime,
    updateDocument
};
