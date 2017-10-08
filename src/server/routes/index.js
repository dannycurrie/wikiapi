const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

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

    let title = req.sanitize(req.params.title);

    indexController.getAvailableRevisions(title, (error, revisions) => {

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

    let title = req.sanitize(req.params.title);

    indexController.getLatestDocument(title, (error, document) => {

        if (error) {
            res.send(error);
        }

        if (document) {
            res.status(200);
            res.json(document);
        }
    });
});

router.get('/documents/:title/:time', [
  check('time').isISO8601()
  .withMessage('Unrecognised Date format')
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    let title = req.sanitize(req.params.title);

    indexController.getDocumentAtTime(title, req.params.time, (error, document) => {

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

    let content = req.sanitize(req.body.content);
    let title = req.sanitize(req.body.title);

    indexController.updateDocument(title, content, (error, document) => {

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
