//During the test the env variable is set to test
process.env.NODE_EN = 'test';

const mongoose = require("mongoose");
const Book     = require('../app/models/book');

//Require the dev-dependencies
const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../server');
const should   = chai.should();
const expect   = chai.expect;


chai.use(chaiHttp);
//Our parent block
describe('Books', () => {
  beforeEach((done) => { //Before each test we empty the database
      Book.remove({}, (err) => { 
        done();         
      });     
    });
  
  /*
  * Initial test route
  */
  describe("/GET list of books:", () => {
    // #1 should return home page
    it('it should check if route is valid', (done) => {
      chai.request(server)
        .get('/book/list')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  /*
  * get all books
  */
  describe('/GET book:', () => {
      it('it should GET all the books', (done) => {
        chai.request(server)
            .get('/book/list')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.an('object');
              done();
            });
      });
  });

  /*
  * Test the /POST route
  */
  describe('/POST book', () => {
    it('it should not POST a book without pages field', (done) => {
      let book = {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        year: 1954,
      }
      chai.request(server)
        .post('/book/create')
        .send(book)
        .end((err, res) => {
          // csrf token not yet implemented
          expect(res).to.have.status(403);
          expect(res).to.be.an('object');
          expect(res).to.have.property('error');
          done();
        });
    });
    it('it should POST a book ', (done) => {
      let book = {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        year: 1954,
        pages: 1170
      }
      chai.request(server)
        .post('/book/create')
        .send(book)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res).to.be.an('object');
          expect(res).to.have.a.property('message').eql('Successfully added a new book!.');
          done();
        });
    });
  });

});

 
  