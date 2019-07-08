# Northcoders News

Northcoders News stores Articles, Comments, Users, and Topics within a PostgresSQL database. The 

NC News is a web application designed to act as a repository for news articles. The relational database stores the Articles, Comments, Topics, and Users.

Hosted: https://mike-ns-news.herokuapp.com/

## Getting Started

### Prerequisites

- node version 10
- npm version 6
- PostgreSQL version 11

### Installation

Clone this repository

```bash
git clone https://github.com/beanshearer/northcoders_news_api.git
```

Move into the correct repository

```bash
cd northcoders_news_api
```

Install the dependencies

```bash
npm install
```

Run the database setup script

```bash
npm run setup:dbs
```

Seed the database

```bash
npm run seed:run
```

Run the api locally 

```bash
npm start
```

To stop running the local server

```bash
ctrl + c
```

### Usage

Once the server is up and running the following endpoints and methods will be available.

Note: GET request can be ran from a browser using "localhost:9090" before an endpoint, however all other methods will require an API testing tool.

- /api:

  - GET - will respond with an object containing the endpoints along with a description of what will return and any rules for the method.
  - The URL should resemble - "localhost:9090/api"

- /api/topics:

  - GET:

    - Description: Returns an on object containing an array of all topics
    - Response example:

    ```json
    {
      "topics": [
        {
          "slug": "coding",
          "description": "Code is love, code is life"
        },
        {
          "slug": "football",
          "description": "FOOTIE!"
        },
        {
          "slug": "cooking",
          "description": "Hey good looking, what you got cooking?"
        }
      ]
    }
    ```

* /api/articles:

  - GET:

    - Description: Returns an on object containing an array of all articles
    - Response Example:

    ```js
    {
      "total_count": 12,
      "articles": [
        {
          "article_id": 1,
          "title": "Example title",
          "body": "Example body",
          "votes": 100,
          "topic": "Example topic",
          "author": "Example author",
          "created_at": "YYYY-MM-DD'T'HH: MM: SS.SSS'Z'",
          "comment_count": "13"
        },
        {
          "article_id": 3,
          "title": "Example title",
          "body": "Example body",
          "votes": 0,
          "topic": "Example topic",
          "author": "Example author",
          "created_at": "YYYY-MM-DD'T'HH: MM: SS.SSS'Z'",
          "comment_count": "0"
        }
      ]
    }
    ```

    - Query Example:
      https://localhost:9090/api/articles?author=[AUTHOR]&topic=[TOPIC]&sort_by=[COLUMN]&order=[ORDER]

    - Query Rules:

    ```js
    {
      "AUTHOR": "FILTER, by the username",
      "TOPIC": "FILTER, by topic",
      "COLUMN": [
        "article_id",
        "title",
        "body",
        "votes",
        "topic",
        "author",
        "created_At",
        "comment_count"
      ],
      "ORDER": ["asc", "desc"]
    }
    ```

  - POST:

    - Description: Returns the record of the newly post article
    - Body Example:

    ```js
    {
      "title": "title_here",
      "body": "body_here",
      "topic": "topic_here",
      "username": "username_here"
    }
    ```

    - Response Example:

    ```js
    {
      "article": {
        "article_id": "1",
        "title": "title_here",
        "body": "body_here",
        "votes": 0,
        "topic": "topic_here",
        "author": "username_here",
        "created_at": "YYYY-MM-DD'T'HH: MM: SS.SSS'Z'"
      }
    }
    ```

* /api/articles/:article_id:

  - **Note: :article_id must be an integer**
  - GET:

    - Description: Returns an on object containing the article with the matching id
    - Response:

    ```js
    {
      "article": {
        "article_id": 1,
        "title": "Living in the shadow of a great man",
        "body": "I find this existence challenging",
        "votes": 100,
        "topic": "mitch",
        "author": "butter_bridge",
        "created_at": "2018-11-15T12: 21: 54.000Z",
        "comment_count": "13"
      }
    }
    ```

  - PATCH:

    - Description: Returns an object containing the updated article
    - Body Example:

    ```js
    {
      "inc_votes": 2
    }
    ```

    - Response:

    ```js
    "response": {
        "article": {
          "article_id": 1,
          "title": "Living in the shadow of a great man",
          "body": "I find this existence challenging",
          "votes": 102,
          "topic": "mitch",
          "author": "butter_bridge",
          "created_at": "2018-11-15T12: 21: 54.000Z",
          "comment_count": "13"
        }
      }
    ```

  - DELETE:
    - Description: Returns a status:204 with no body

* /api/articles/:article_id/comments

  - **Note: :article_id must be an integer**
  - GET:
    Description: Returns an on object an array of comments related to the article

    - Response Example:

    ```js
    {
      "comments": [
        {
          "comment_id": 2,
          "author": "butter_bridge",
          "article_id": 1,
          "votes": 14,
          "created_at": "2016-11-22T12: 36: 03.000Z",
          "body": "Example comment body"
        }
      ]
    }
    ```

    - Query Example:
      https://localhost:9090/api/articles?sort_by=[COLUMN]&order=[ORDER]

    - Query Rules:

      ```js
      {
        "COLUMN": ["comment_id", "body", "votes", "author", "created_At"],
        "ORDER": ["asc", "desc"]
      }
      ```

  - POST:

    - Description: Returns an object with the newly added comment
    - Body Example:

    ```js
    {
      "username": "username_here",
      "body": "body_here"
    }
    ```

    - Response Example:

    ```js
    {
      "comment": {
        "comment_id": 19,
        "author": "username_here",
        "article_id": 1,
        "votes": 0,
        "created_at": "YYYY-MM-DD'T'HH: MM: SS.SSS'Z'",
        "body": "body_here"
      }
    }
    ```

* /api/comments/:comment_id:

  - **Note: comment_id must be an integer**
  - PATCH:
    - Description: Returns an object containing the updated comment
    - Body Example:
    ```js
    {
      "inc_votes": 2
    }
    ```
    - Response Example:
    ```js
    {
      "comment": {
        "comment_id": 2,
        "author": "username_here",
        "article_id": 1,
        "votes": 17,
        "created_at": "YYYY-MM-DD'T'HH: MM: SS.SSS'Z'",
        "body": "body_here"
      }
    }
    ```
  - Delete:
    - Description: Returns a status:204 with no body

* /api/users:

  - GET:
    - Description: Returns an on object containing an array of all users
    - Response:
    ```js
    {
      "users": [
        {
          "username": "butter_bridge",
          "avatar_url": "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          "name": "jonny"
        }
      ]
    }
    ```
  - POST:
    - Description: Returns an object with the newly added user
    - Body Example:
    ```js
    {
      "username": "username_here",
      "avatar_url": "https: //www.longstring.com",
      "name": "bill"
    }
    ```
    - Response:
    ```js
    {
      "user": {
        "username": "username_here",
        "avatar_url": "https://www.longstring.com",
        "name": "bill"
      }
    }
    ```

* /api/users/:username:

  - GET:
    - Description: Returns an object with the user
    - Response Example:
    ```js
    {
      "user": {
        "username": ":username",
        "avatar_url": "https: //avatars2.githubusercontent.com/u/24394918?s=400&v=4",
        "name": "paul"
      }
    }
    ```

### Running the tests

In order to run the automated tests, you will need to run the "test" script

```bash
npm test
```

### Built with

- Express.js - Back-end Framework
- Knex.js - Query builder for SQL based databases
- postgreSQL - Object-relational database management system
- Testing:
  - Mocha
  - Chai

### Version

- 1.0

### Author

Mike Frank (ladysneezes)

### Acknowledgements

# nc-news-mike

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
