

function getAvailableTitles(callback) {
  let titles = [ 
    { title: 'Title One' },
    { title: 'Title Two' }
  ];

  callback(null, titles);
}

function getAvailableRevisions (title, callback) {
  console.log('requesting revisions for document: ' + title);

  let revisions = [
    { revision: '123' },
    { revision: '321' }
  ];

  callback(null, revisions);
}

function getLatestDocument(title, callback) {
  console.log('requesting latest version of ' + title);

  let result = {
    title: title,
    revision: '456',
    content: 'Here is the latest content'
  };

  callback(null, result);
}

function getDocumentAtTime(title, time, callback) {

  console.log('requesting ' + title + ' at ' + time);

  let result = {
    title: title,
    revision: '321',
    content: 'Here is the content at specific time'
  };

  callback(null, result);
}

function updateDocument(title, content, callback) {

  console.log('updating ' + title);

  let updatedDoc = {
    title: title,
    revision: '321',
    content: 'Here is the updated content'
  };

  callback(null, updatedDoc);
}

module.exports = {
  getAvailableTitles,
  getAvailableRevisions,
  getLatestDocument,
  getDocumentAtTime,
  updateDocument
};
