process.env.NODE_ENV = "test";
const chai = require("chai");
expect = chai.expect;
chai.use(require("chai-sorted"));
const request = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

describe("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/api", () => {
    describe("/topics", () => {
      it("GET status:200, returns all the topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.eql([
              { slug: "mitch", description: "The man, the Mitch, the legend" },
              { slug: "cats", description: "Not dogs" },
              { slug: "paper", description: "what books are made of" }
            ]);
          });
      });
    });

    describe("/user/:users", () => {
      it("GET status:200, returns the correct user", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.eql({
              username: "butter_bridge",
              name: "jonny",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
            });
          });
      });
      it("GET status:404, returns user not found", () => {
        return request(app)
          .get("/api/users/busdfr_bridgsdfsdf")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("user not found");
          });
      });
    });
    describe("/articles", () => {
      describe("/:articles_id", () => {
        describe("GET", () => {
          it("status:200, returns the relevent article", () => {
            return request(app)
              .get("/api/articles/3")
              .expect(200)
              .then(({ body }) => {
                expect(body.article).to.have.keys(
                  "author",
                  "title",
                  "article_id",
                  "body",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
                );
              });
          });
          it("status:404, returns article not found when the the valid article number does not exist", () => {
            return request(app)
              .get("/api/articles/300000")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("article not found");
              });
          });
          it("status:400, returns error message when the given an invalid request", () => {
            return request(app)
              .get("/api/articles/30BassSAND")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  'invalid input syntax for integer: "30BassSAND"'
                );
              });
          });
        });
        describe("PATCH", () => {
          it("status:200, returns the correct article", () => {
            return request(app)
              .patch("/api/articles/2")
              .send({ inc_votes: 10 })
              .expect(200)
              .then(({ body }) => {
                expect(body.article).to.have.keys(
                  "author",
                  "title",
                  "article_id",
                  "body",
                  "topic",
                  "created_at",
                  "votes"
                );
              });
          });
          it("status:404, returns article not found when the the valid article number does not exist", () => {
            return request(app)
              .patch("/api/articles/299959495")
              .send({ inc_votes: 10 })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("article not found");
              });
          });
          it("status:200 - increases the vote by 1", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body }) => {
                expect(body.article.votes).to.equal(101);
              });
          });
          it("status:200 - doesn't increase the vote when an empty object is send", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({})
              .expect(200)
              .then(({ body }) => {
                expect(body.article.votes).to.equal(100);
              });
          });
          it("status:400, returns invalid syntax when passed a URL with letters", () => {
            return request(app)
              .patch("/api/articles/hjbskbhsd")
              .send({ inc_votes: 10 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  'invalid input syntax for integer: "hjbskbhsd"'
                );
              });
          });
          it("status:400, returns invalid syntax when passed an object in the wrong format", () => {
            return request(app)
              .patch("/api/articles/3")
              .send({ inc_votes: "bread" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  'invalid input syntax for integer: "NaN"'
                );
              });
          });
        });
        describe("/comments", () => {
          describe("POST", () => {
            it("status:201, returns the updates comments", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({
                  body: "LEAVE, GET OUT, LEAVE, RIGHT NOW",
                  username: "icellusedkars"
                })
                .expect(201)
                .then(({ body }) => {
                  expect(body.comment).to.have.keys(
                    "comment_id",
                    "author",
                    "article_id",
                    "votes",
                    "created_at",
                    "body"
                  );
                });
            });
            it("status:400, returns relevent error when not provided with all the information", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ body: "this is a comment" })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    'null value in column "author" violates not-null constraint'
                  );
                });
            });
            it("status:404, returns 'article not found' when trying to assign a comment to an articles", () => {
              return request(app)
                .post("/api/articles/4000/comments")
                .send({
                  body: "LEAVE, GET OUT, LEAVE, RIGHT NOW",
                  username: "icellusedkars"
                })
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.equal("article not found");
                });
            });
            it("status:400, returns syntax error when not given an integer", () => {
              return request(app)
                .post("/api/articles/hsdfhhsdf/comments")
                .send({ body: 4 })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    'invalid input syntax for integer: "hsdfhhsdf"'
                  );
                });
            });
          });
          describe("GET", () => {
            it("status:200 returns an array", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.a("array");
                });
            });
            it("status:200 defaults to descending created_at", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.descendingBy("created_at");
                });
            });
            it("status:200, sort by author in descending order", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=author&order=desc")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.descendingBy("author");
                });
            });
            it("status:400, gets bad request when sending a bad query", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=autsdfr&order=bread")
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal('column "autsdfr" does not exist');
                });
            });
            it("status:404, returns not found when the article doesn't exist", () => {
              return request(app)
                .get("/api/articles/4000/comments")
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.equal("article not found");
                });
            });
          });
        });
      });
      describe("/", () => {
        describe("GET", () => {
          it("status:200 returns an array of article objects", () => {
            return request(app)
              .get("/api/articles/")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.a("array");
                expect(body.articles[0]).to.have.keys(
                  "author",
                  "title",
                  "article_id",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
                );
              });
          });
          it("status:200 returns the corrent comment count", () => {
            return request(app)
              .get("/api/articles/")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles[0].comment_count).to.equal("13");
              });
          });
          it("status:200 returns an array of article objects", () => {
            return request(app)
              .get("/api/articles/")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.a("array");
                expect(body.articles[0]).to.have.keys(
                  "author",
                  "title",
                  "article_id",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
                );
              });
          });
          it("status:200 returns an array of article objects sorted by topic", () => {
            return request(app)
              .get("/api/articles/?sort_by=topic")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.descendingBy("topic");
              });
          });
          it("status:200 returns an array of length five", () => {
            return request(app)
              .get("/api/articles/?limit=5")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles.length).to.equal(5);
              });
          });
          it("status:200 returns a total_count of 17", () => {
            return request(app)
              .get("/api/articles/")
              .expect(200)
              .then(({ body }) => {
                expect(body.total_count).to.equal(12);
              });
          });
          it("status:200 returns an array of length 10 from position 3", () => {
            return request(app)
              .get("/api/articles/?p=2")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles.length).to.equal(10);
              });
          });
          it("status:400, returns column doesn't exist when then trying to sort using a column that doesn't exist", () => {
            return request(app)
              .get("/api/articles/?sort_by=topdfgisdc")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal('column "topdfgisdc" does not exist');
              });
          });
          it("status:200 returns an array of article objects sorted by topic", () => {
            return request(app)
              .get("/api/articles/?sort_by=topic")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.descendingBy("topic");
              });
          });
          it("status:200 returns an array of descending by created_at", () => {
            return request(app)
              .get("/api/articles/?order=desc")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.descendingBy("created_at");
              });
          });
          it("status:200 returns an array of one author's articles", () => {
            return request(app)
              .get("/api/articles/?author=icellusedkars")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.a("array");
              });
          });
          it("status:200 returns an array of descending by article_id", () => {
            return request(app)
              .get("/api/articles/?topic=cats")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles[0].topic).to.equal("cats");
              });
          });
          it("status:200 returns 'no topic' when the topic doesn;t exist", () => {
            return request(app)
              .get("/api/articles/?topic=menchildren")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("no topic");
              });
          });
        });
      });
    });
    describe("/comments/:comment_id", () => {
      describe("PATCH", () => {
        it("status:200, changes the the votes value and returns the comments with the new votes", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 10 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.have.keys(
                "comment_id",
                "author",
                "article_id",
                "body",
                "created_at",
                "votes"
              );
            });
        });
        it("status:400, 'invalid input syntax' error when passed a string instead of an integer", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "asdgasgh" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                'invalid input syntax for integer: "NaN"'
              );
            });
        });
        it("status:404, returns 'comment not found' when the valid comment integer does not exist", () => {
          return request(app)
            .patch("/api/comments/5354345")
            .send({ inc_votes: "5" })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("comment not found");
            });
        });
        it("status:400, returns 'comment not found' when the url isn't an integer", () => {
          return request(app)
            .patch("/api/comments/535434gsdhj5")
            .send({ inc_votes: "5" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                'invalid input syntax for integer: "535434gsdhj5"'
              );
            });
        });
      });
      describe("DELETE", () => {
        it("status:204, successfully deletes comment", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then(({ body }) => {
              expect(body).to.eql({});
            });
        });
        it("status:404, saying comment not found when valid comment number doesn't exist", () => {
          return request(app)
            .delete("/api/comments/400")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.eql("comment not found");
            });
        });
        it("status:400, return syntax error when passed a url with the wrong characters", () => {
          return request(app)
            .delete("/api/comments/sdfhgsdf")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql(
                'invalid input syntax for integer: "sdfhgsdf"'
              );
            });
        });
      });
    });
  });
});
