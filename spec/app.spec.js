process.env.NODE_ENV = 'test';

// const { expect } = require('chai');
var chai = require("chai"),
    expect = chai.expect; // preference and tested with expect

chai.use(require("chai-sorted"));
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
            it('status:200 returns an array', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.a('array')
                });
            });
            it('status:200 defaults to ascending comment_id', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.ascendingBy('comment_id')
                });
            });
            it('status:200, sort by author in descending order', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=author&order=desc')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.descendingBy('author')
                });
            });
            it('status:400, gets bad request when sending a bad query', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=autsdfr&order=bread')
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal('bad request')
                });
            });
            it("status:400, gets error when comments can't be found", () => {
              return request(app)
                .get('/api/articles/4000/comments')
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal('article has no comments or does not exist')
                });
            });
          });
        });
      });
      describe('/', () => {
        describe('GET', () => {
          it('status:200 returns an array of article objects', () => {
            return request(app)
              .get('/api/articles/')
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.a('array')
                expect(body.articles[0]).to.have.keys('author','title','article_id','body','topic','created_at','votes','comment_count')
              });
          });
          it('status:200 returns an array of article objects', () => {
            return request(app)
              .get('/api/articles/')
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.a('array')
                expect(body.articles[0]).to.have.keys('author','title','article_id','body','topic','created_at','votes','comment_count')
              });
          });
          it('status:200 returns an array of article objects sorted by topic', () => {
            return request(app)
              .get('/api/articles/?sort_by=topic')
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.ascendingBy('topic')
              });
          });
          it('status:200 returns an array of article objects sorted by topic', () => {
            return request(app)
              .get('/api/articles/?sort_by=topic')
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.ascendingBy('topic')
              });
          });
          it('status:200 returns an array of descending by article_id', () => {
            return request(app)
              .get('/api/articles/?order=desc')
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.descendingBy('article_id')
              });
          });
          it("status:200 returns an array of one author's articles", () => {
            return request(app)
              .get('/api/articles/?author=icellusedkars')
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.a('array')
              });
          });
          it('status:200 returns an array of descending by article_id', () => {
            return request(app)
              .get('/api/articles/?topic=cats')
              .expect(200)
              .then(({ body }) => {
                expect(body.articles[0].topic).to.equal('cats')
              });
          });
        });
      });
    });
    describe('/comments/:comment_id', () => {
      describe('PATCH', () => {
        it('status:200', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({  inc_votes: 10 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.have.keys('comment_id','author','article_id','body','created_at','votes')
            });
        });
        it('status:400', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({  inc_votes: 'asdgasgh' })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('bad request')
            });
        });
        it('status:404', () => {
          return request(app)
            .patch('/api/comments/5354345')
            .send({  inc_votes: '5' })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('comment not found')
            });
        });
        it('status:400', () => {
          return request(app)
            .patch('/api/comments/535434gsdhj5')
            .send({  inc_votes: '5' })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('bad request')
            });
        });
      });
      describe('DELETE', () => {
        it('status:204', () => {
          return request(app)
            .delete('/api/comments/1')
            .expect(204)
            .then(({ body }) => {
              expect(body).to.eql({})
            });
        });
        it('status:404', () => {
          return request(app)
            .delete('/api/comments/400')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.eql('comment not found')
            });
        });
        it('status:400', () => {
          return request(app)
            .delete('/api/comments/sdfhgsdf')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql('bad request')
            });
        });
      });
    });
  });
});