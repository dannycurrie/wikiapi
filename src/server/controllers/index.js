const docService = require('../services/document-service');

function getAvailableTitles(callback) {
  // call to data service for titles
  // TODO - better as a promise?
  docService.getTitles(callback);
}

function getAvailableRevisions (title, callback) {
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

  let updatedDoc = null;

  callback('not implemented exception', updatedDoc);
}

module.exports = {
  getAvailableTitles,
  getAvailableRevisions,
  getLatestDocument,
  getDocumentAtTime,
  updateDocument
};
