process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

var server = require('../../src/server/app');
var fileStoreSeed = require('../../src/server/documentstore/seed');

describe('routes : index', function() {

  beforeEach(function(done) {
    fileStoreSeed.clearFileStore();
    fileStoreSeed.setUpTestDocs();
    done();
  });

  afterEach(function(done) {
    fileStoreSeed.clearFileStore();
    done();
  });

  describe('GET / DOCUMENTS', function() {
    it('should return list of available document titles', function(done) {
      chai.request(server)
      .get('/documents')
      .end(function(err, res) {

        // route exists
        res.status.should.equal(200);

        // check appropriate list of titles returned
        res.type.should.equal('application/json');
        res.body.should.be.a('array');
        res.body.length.should.be.eql(2);
        let titles = res.body;
        titles[0].should.equal('testDocOne');
        titles[1].should.equal('testDocTwo');

        done();
      });
    });
  });

  describe('GET / DOCUMENTS / <title>', function() {

    let title = 'testDocOne';

    it('should return list of available revisions for a document with the supplied title', function(done) {
      chai.request(server)
      .get('/documents/' + title)
      .end(function(err, res) {
        res.status.should.equal(200);

        // check appropriate list of titles returned
        res.type.should.equal('application/json');
        res.body.should.be.a('array');
        res.body.length.should.be.eql(2);
        let revisions = res.body;
        revisions[0].should.equal('1');
        revisions[1].should.equal('2');

        done();
      });
    });
  });

    describe('GET / DOCUMENTS / <title> / <timestamp>', function() {

      let title = 'testDocOne';
      let time = '2017-10-06T00:00:00Z';

      var expectedResult = {
        title: title,
        revision: '1',
        content: 'Content for test doc one'
      };

    it('should return the document as it was at that time', function(done) {
      chai.request(server)
      .get('/documents/' + title + '/' + time)
      .end(function(err, res) {
        res.status.should.equal(200);

        // TODO
        // check appropriate content returned
        res.type.should.equal('application/json');
        res.body.should.have.property('title').eql(expectedResult.title);
        res.body.should.have.property('content').equal(expectedResult.content);
        res.body.should.have.property('revision').equal(expectedResult.revision);

        done();
      });
    });
  });

    describe('GET / DOCUMENTS / <title> / LATEST', function() {

      let title = 'testDocOne';

      var expectedResult = {
        title: title,
        revision: '2',
        content: 'Content for test doc one revision 2'
      };

    it('should return current version of the document with the supplied title', function(done) {
      chai.request(server)
      .get('/documents/' + title + '/latest')
      .end(function(err, res) {
        res.status.should.equal(200);

        // TODO
       // check appropriate content returned
      res.type.should.equal('application/json');
      res.body.should.have.property('title').eql(expectedResult.title);
      res.body.should.have.property('content').equal(expectedResult.content);
      res.body.should.have.property('revision').equal(expectedResult.revision);

        done();
      });
    });
  });

    describe('POST / DOCUMENTS / <title>', function() {

      let updatedDoc = {
        title: 'updated document',
        revision: '321',
        content: 'Here is the updated content'
      };

    it('should create a new revision of the document', function(done) {
      chai.request(server)
      .post('/documents/' + updatedDoc.title)
      .send(updatedDoc)
      .end(function(err, res) {
        res.status.should.equal(200);

        res.body.should.be.a('object');
        res.body.should.have.property('message').equal(updatedDoc.title + ' successfully updated');

        // todo - check updated content
        
        done();
      });
    });
  });

  describe('GET /404', function() {
    it('should throw an error', function(done) {
      chai.request(server)
      .get('/404')
      .end(function(err, res) {
        res.redirects.length.should.equal(0);
        res.status.should.equal(404);
        res.type.should.equal('application/json');
        res.body.message.should.eql('Not Found');
        done();
      });
    });
  });

});
