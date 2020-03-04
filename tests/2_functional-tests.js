/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
         chai.request(server)
          .post('/api/books')
          .send({title: 'Wiedzmin'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json', "Response should be json");
            assert.isDefined(res.body._id, 'res.body._id should be defined');
            assert.equal(res.body.title, 'Wiedzmin', 'res.body.title should be "Wiedzmin"');
            assert.isArray(res.body.comments, 'res.body.comments should be an array');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
         chai.request(server)
          .post('/api/books')
          .send()
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html', "Response should be text");
            assert.equal(res.text, 'missing title', 'res.text should be "missing title"');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
         chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
         chai.request(server)
          .get('/api/books/5e5fef078327c34c2c2a9eaf')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html', "Response should be text");
            assert.equal(res.text, 'no book exists', 'res.text should be "no book exists"');
            done();
         })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
         chai.request(server)
          .get('/api/books/5e5fef078327c34c2c2a9ead')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json', "Response should be json");
            assert.equal(res.body._id, '5e5fef078327c34c2c2a9ead','res.body._id should be "5e5fef078327c34c2c2a9ead"');
            assert.equal(res.body.title, 'Inkwizytor 4', 'res.body.title should be "Inkwizytor 4"');
            assert.isArray(res.body.comments, 'res.body.comments should be an array');
            done();
         })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
         chai.request(server)
          .post('/api/books/5e5fef078327c34c2c2a9ead')
          .send({comment: 'comment'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json', "Response should be json");
            assert.equal(res.body._id, '5e5fef078327c34c2c2a9ead','res.body._id should be "5e5fef078327c34c2c2a9ead"');
            assert.equal(res.body.title, 'Inkwizytor 4', 'res.body.title should be "Inkwizytor 4"');
            assert.isArray(res.body.comments, 'res.body.comments should be an array');
            done();
          });
      });
      
    });

  });

});
