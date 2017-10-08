# WIKI API

Simple Rest API for requesting and updating Wiki documents

* A wiki is a collection of documents.
* Documents are a lump of plain text. No graphics, attachments, or formatting.
* Each document is uniquely identified by a title that is a maximum of 50 characters in length. This title does not change for the life of the document.
* A document can have multiple revisions, as it is updated over time. We store all 
historical revisions of a document.
## Getting Started

### Installing

* Clone to desired directory
* Open terminal at desired directory
* run 'npm install'
* run 'gulp'

## Running the tests

* Open terminal at project directory
* run 'npm test'

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Michael Herman's Express generator with Mocha/Chai test set up https://www.npmjs.com/package/generator-galvanize-express

## Future improvements  / developments
* Additional unit testing
* Deployment
* Switch to document database for improved performance as document store scales
