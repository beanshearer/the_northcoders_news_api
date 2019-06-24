# sup

Northcoders News

The Northcoders News API has been designed to send news articles and comments based on diffent paramenters such as different topics, author and amount of votes. The API can update the amount of votes as well as post and delete comments. The returned data is sent in an object with a key of the requested information and the value of the object with that information.

Installation

\$ npm i express knex pg

\$ npm i -D chai chai-sorted mocha nodemon supertest

Routes

GET /api/topics

GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api

Responces

GET /api/topics

Should send all of the topics in an array with the topuics as object with keys of 'slug' and 'description'. For example:

{
topics: [
{
slug: "coding",
description: "Code is love, code is life"
}
]
}

GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api

Testing

For the routes:

\$ npm test

For the functions used for seeding:

\$ npm util-test

## Available Scripts

Create development and test databases locally:

```bash
npm run setup-dbs
```

Create a new migration file:

```bash
npm run migrate-make <filename>
```

Run all migrations:

```bash
npm run migrate-latest
```

Rollback all migrations:

```bash
npm run migrate-rollback
```

Run tests:

```bash
npm test
```

Rollback, migrate -> latest, then start inserting data into the database:

```bash
npm run seed
```

Run the server with `nodemon`, for hot reload:

```bash
npm run dev
```

Run the server with `node`:

```bash
npm start
```
