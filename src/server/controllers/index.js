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

  let result = null;

  callback('not implemented exception', result);
}

function getDocumentAtTime(title, time, callback) {

  console.log('requesting ' + title + ' at ' + time);

  let result = null;

  callback('not implemented exception', result);
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
