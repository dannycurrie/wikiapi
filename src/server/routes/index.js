const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');

router.get('/', function (req, res, next) {
    const renderObject = {};
    renderObject.title = 'Wiki Document API';
    res.render('index', renderObject);
});

router.get('/documents', (req, res) => {

    indexController.getAvailableTitles((error, titles) => {

        console.log(titles);

        if (error) {
            res.send(error);
        }

        if (titles) {
            res.status(200);
            res.json(titles);
        }
    });
});

router.get('/documents/:title', (req, res) => {

    indexController.getAvailableRevisions(req.params.title, (error, revisions) => {

        if (error) {
            res.send(error);
        }

        if (revisions) {
            res.status(200);
            res.json(revisions);
        }
    });
});

router.get('/documents/:title/latest', (req, res) => {

    indexController.getLatestDocument(req.params.title, (error, document) => {

        if (error) {
            res.send(error);
        }

        if (document) {
            res.status(200);
            res.json(document);
        }
    });
});

router.get('/documents/:title/:time', (req, res) => {
    indexController.getDocumentAtTime(req.params.title, req.params.time, (error, document) => {

        if (error) {
            res.send(error);
        }

        if (document) {
            res.status(200);
            res.json(document);
        }
    });
});

router.post('/documents/:title', (req, res) => {

    indexController.updateDocument(req.body.title, req.body.content, (error, document) => {

        if (error) {
            res.send(error);
        }

        if (document) {
            res.status(200);
            res.json({message: document.title + ' successfully updated', document: document});
        }
    });
});

module.exports = router;
