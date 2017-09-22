//During the test the env variable is set to test
process.env.NODE_EN = 'test';

const mongoose       = require("mongoose");
const Book           = require('../app/models/book');

//Require the dev-dependencies
const chai           = require('chai');
const chaiHttp       = require('chai-http');
const server         = require('../server');
const should         = chai.should();
const expect         = chai.expect;
const csrf           = require('csurf');
const csrfProtection = csrf();

chai.use(require('chai-json-schema'));
chai.use(chaiHttp);
//Our parent block
describe('Books', () => {
  beforeEach((done) => { //Before each test we empty the database
      Book.remove({}, (err) => { 
        done();         
      });     
    });
  /*
  * Initial test route if route is valid
  */
  describe("/GET list of books:", () => {
    it('it expect to check if route is valid', (done) => {
      chai.request(server)
        .get('/book/list')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  /*
  * Test the /Get for getting the list of all books
  */
  describe('/GET book:', () => {
      it('it expect to GET all the books', (done) => {
        chai.request(server)
            .get('/book/list')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.books).to.be.an('array');
                expect(res.body.message).to.be.a('string');
                expect(res.body.success).to.equal(true);
              done();
            });
      });
  });

  /*
  * Test the /Get for creating a new book
  */
  describe('/GET the form for creating new book:', () => {
      it('it expect to GET the form for creating adding a new book', (done) => {
        chai.request(server)
            .get('/book/create')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.an('object');
                expect(res.body.success).to.equal(true);
              done();
            });
      });
  });

  /*
  * Test the /POST route for creating new book
  */
  describe('/POST book', () => {
    // with error, pages is required
    it('it expect to not POST a book without pages field', (done) => {
      let book = {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        year: 1954,
      }
      chai.request(server)
        .post('/book/create')
        .send( book )
        .end((err, res) => {
          // csrf token not yet implemented
          expect(res).to.have.status(500);
          expect(res).to.be.an('object');
          done();
        });
    });
    // without error success
    it('it expect to POST a book ', (done) => {
      let book = {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        year: 1954,
        pages: 1170
      }
      chai.request(server)
        .post('/book/create')
        .send( book )
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');
          expect(res.body.success).to.equal(true)
          expect(res.body.message).to.equal('Successfully added a new book!.');
          done();
        });
    });
  });

});

 
  