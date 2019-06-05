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
      it('GET status:404', () => {
        return request(app)
          .get('/api/users/')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql('user not found');
          });
      });
    });
    describe('/articles', () => {
      it.only('GET status:200', () => {
        return request(app)
          .get('/api/articles/3')
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.have.keys('author','title','article_id','body','topic','created_at','votes','comment_count')
          });
      });
    });
  });
});
