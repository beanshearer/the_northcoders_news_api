process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const request = require('supertest');

const app = require('../app');
const connection = require('../db/connection');

describe('/', () => {
  
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe('/api', () => {
    describe('/topics', () => {
      it('GET status:200', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.eql([
              { slug: 'mitch', description: 'The man, the Mitch, the legend' },
              { slug: 'cats', description: 'Not dogs' },
              { slug: 'paper', description: 'what books are made of' }
            ]);
          });
      });
    });

    describe('/user/:users', () => {
      it('GET status:200', () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.eql({
              username: 'butter_bridge',
              name: 'jonny',
              avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
            });
          });
      });
      it('GET status:404', () => {
        return request(app)
          .get('/api/users/busdfr_bridgsdfsdf')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql('user not found');
          });
      });
    });
    describe('/articles', () => {
      describe('/:articles_id', () => {
        describe('GET', () => {
          it('status:200', () => {
            return request(app)
              .get('/api/articles/3')
              .expect(200)
              .then(({ body }) => {
                expect(body.article).to.have.keys('author','title','article_id','body','topic','created_at','votes','comment_count')
              });
          });
          it('status:404', () => {
            return request(app)
              .get('/api/articles/300000')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal('article not found')
              });
          });
          it('status:400', () => {
            return request(app)
              .get('/api/articles/30BassSAND')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal('bad request')
              });
          });
        });
        describe('PATCH', () => {
          it('status:200', () => {
            return request(app)
              .patch('/api/articles/2')
              .send({  inc_votes: 10 })
              .expect(200)
              .then(({ body }) => {
                expect(body.article).to.have.keys('author','title','article_id','body','topic','created_at','votes')
              });
          });
          it('status:404', () => {
            return request(app)
              .patch('/api/articles/299959495')
              .send({  inc_votes: 10 })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal('article not found')
              });
          });
          it('status:400', () => {
            return request(app)
              .patch('/api/articles/hjbskbhsd')
              .send({  inc_votes: 10 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal('bad request')
              });
          });
          it('status:400', () => {
            return request(app)
              .patch('/api/articles/3')
              .send({  inc_votes: 'bread' })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal('bad request')
              });
          });
        });
        describe('/comments', () => {
          describe('POST', () => {
            it('status:200', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({  body : "LEAVE, GET OUT, LEAVE, RIGHT NOW", username : 'icellusedkars' })
                .expect(200)
                .then(({ body }) => {
                  expect(body.comment).to.equal("LEAVE, GET OUT, LEAVE, RIGHT NOW")
                });
            });
            it('status:400', () => {
              return request(app)
                .post('/api/articles/4000/comments')
                .send({  body : "LEAVE, GET OUT, LEAVE, RIGHT NOW", username : 'icellusedkars' })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal('bad request')
                });
            });
            it('status:400', () => {
              return request(app)
                .post('/api/articles/4000/comments')
                .send({  body : 4 })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal('bad request')
                });
            });
          });
          describe('GET', () => {
            it.only('status:200', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                  console.log(body)
                  expect(body.comments).to.be.a('array')
                });
            });
          });
        });
      });
    });
  });
});
