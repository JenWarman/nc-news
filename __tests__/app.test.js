const db = require('../db/connection');
const app = require('../errors');
const data = require('../db/data/test-data');
const request = require("supertest");
const seed = require("../db/seeds/seed");
const endPoints = require('../endpoints.json')


beforeEach(() => {
    return seed(data);
});
afterAll(() => {
    return db.end();
});

describe('nc-news API', () => {
    describe('GET /api/topics', () => {
        test('200: returns correct properties of topic object', () => {
            return request(app).get('/api/topics')
                .expect(200)
                .then(({ body }) => {
                    body.rows.forEach((topic) => {
                        expect(topic).toHaveProperty("description", expect.any(String));
                        expect(topic).toHaveProperty("slug", expect.any(String));
                    })
                })
        });
        test('200: returns topics in alphabetical order according to the slug property', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body }) => {
                    const slugArray = [];
                    body.rows.forEach((topic) => {
                        slugArray.push(topic.slug);
                    })
                    const alphabetisedTopics = slugArray.sort();
                    expect(slugArray).toEqual(alphabetisedTopics);
                })
        })
    })

    describe('GET /api', () => {
        test('200: returns object with available endpoints', () => {
            return request(app).get('/api')
                .expect(200)
                .then(({ body }) => {
                    const endPointsFromBody = Object.keys(body).filter((endpoint) => {
                        return endpoint;
                    })
                    const endPointsFromFile = Object.keys(endPoints).filter((fileEndPoint) => {
                        return fileEndPoint;
                    })
                    expect(endPointsFromBody).toEqual(endPointsFromFile);
                })
        })
    })

    describe('GET /api/articles/:article_id', () => {
        test('200: responds with object containing article properties when requested with valid article_id', () => {
            return request(app).get('/api/articles/1')
                .expect(200)
                .then(({ body }) => {
                    expect(body).toHaveLength(1);
                    expect(Array.isArray(body)).toBe(true);
                })
        })
        test('404: responds with error message if article_id is valid but does not exist', () => {
            return request(app)
                .get('/api/articles/999')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Request not found');
                })
        })
        test('400: responds with error message if article_id is invalid', () => {
            return request(app)
                .get('/api/articles/IamNotAnId')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request');
                })
        })
    })

    describe('GET /api/articles', () => {
        test('200: responds with array of article objects containing requested properties', () => {
            return request(app).get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles.length).toBeGreaterThan(1)
                    body.articles.forEach((article) => {
                        expect(article).toHaveProperty("author", expect.any(String));
                        expect(article).toHaveProperty("title", expect.any(String));
                        expect(article).toHaveProperty("article_id", expect.any(Number));
                        expect(article).toHaveProperty("topic", expect.any(String));
                        expect(article).toHaveProperty("created_at", expect.any(String));
                        expect(article).toHaveProperty("votes", expect.any(Number));
                        expect(article).toHaveProperty("article_img_url", expect.any(String));
                        expect(article).toHaveProperty("comment_count", expect.any(Number));
                    })
                })
        })
        test('200: returns articles by date in descending order', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("created_at", { descending: true });
                });
        });
    });

    describe('GET /api/articles/:article_id/comments', () => {
        test('200: responds with array of comments for the given article_id', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments.length).toBeGreaterThan(1);
                    body.comments.forEach((comment) => {
                        expect(comment).toHaveProperty("comment_id", expect.any(Number));
                        expect(comment).toHaveProperty("votes", expect.any(Number));
                        expect(comment).toHaveProperty("created_at", expect.any(String));
                        expect(comment).toHaveProperty("author", expect.any(String));
                        expect(comment).toHaveProperty("body", expect.any(String));
                        expect(comment).toHaveProperty("article_id", expect.any(Number));
                    })
                })
        })
        test('200: returns comments in with most recent first', () => {
            return request(app)
                .get('/api/articles/1/comments', () => {
                    expect(200)
                        .then(({ body }) => {
                            expect(body.comments).toBeSortedBy("created_at", { descending: true });
                        })
                })
        })
        test('404: responds with error message if article_id is valid but does not exist', () => {
            return request(app)
                .get('/api/articles/999')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Request not found');
                })
        })
        test('400: responds with error message if article_id is invalid', () => {
            return request(app)
                .get('/api/articles/IamNotAnId')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request');
                })
        })
    })

    describe('POST /api/articles/:article_id/comments', () => {
        test('200: add comment object to article fetched by article_id', () => {
            return request(app)
                .post('/api/articles/1/comments')
                .send({ username: 'lurker', body: 'this is my very good and excellent comment' })
                .expect(200)
                .then(({ body }) => {
                    body.comment.forEach((comment) => {
                        expect(comment).toHaveProperty("author", 'lurker');
                        expect(comment).toHaveProperty("body", 'this is my very good and excellent comment');
                        expect(comment).toHaveProperty("article_id", 1)
                    })
                })
        })
        test('404: responds with error message if article_id is valid but does not exist', () => {
            return request(app)
                .post('/api/articles/999/comments')
                .send({ username: 'lurker', body: 'this is my very good and excellent comment' })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Request not found');
                })
        })
        test('400: responds with error message if article_id is invalid', () => {
            return request(app)
                .post('/api/articles/IamNotAnId/comments')
                .send({ username: 'lurker', body: 'this is my very good and excellent comment' })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request');
                })
        })
        test('404: responds with error message if username is valid but not does not exist', () => {
            return request(app)
                .post('/api/articles/1/comments')
                .send({ username: 'Jen', body: 'this is my very good and excellent comment' })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Request not found')
                })
        })
        test('404: responds with error message if username and body are invalid data type or missing required fields', () => {
            return request(app)
                .post('/api/articles/1/comments')
                .send({ username: 123, body: 456 })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Request not found')
                })
        })
    })

    describe('PATCH /api/articles/:article_id', () => {
        test('200: update an articles  positive vote count using article_id', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({ inc_votes: 1 })
                .expect(200)
                .then(({ body }) => {
                    body.article.forEach((article) => {
                        expect(article).toHaveProperty("article_id", 1)
                        expect(article).toHaveProperty("votes", 101);
                        expect(article).toHaveProperty("author", "butter_bridge");
                        expect(article).toHaveProperty("title", "Living in the shadow of a great man");
                        expect(article).toHaveProperty("topic", "mitch");
                        expect(article).toHaveProperty("created_at", "2020-07-09T20:11:00.000Z");
                        expect(article).toHaveProperty("article_img_url", "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
                    })
                })
        })
        test('200: update an articles  negative vote count using article_id', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({ inc_votes: -100 })
                .expect(200)
                .then(({ body }) => {
                    body.article.forEach((article) => {
                        expect(article).toHaveProperty("article_id", 1)
                        expect(article).toHaveProperty("votes", 0);
                        expect(article).toHaveProperty("author", "butter_bridge");
                        expect(article).toHaveProperty("title", "Living in the shadow of a great man");
                        expect(article).toHaveProperty("topic", "mitch");
                        expect(article).toHaveProperty("created_at", "2020-07-09T20:11:00.000Z");
                        expect(article).toHaveProperty("article_img_url", "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
                    })
                })
        })
        test('400: responds with error message if inc_votes is an invalid data type or empty', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({ inc_votes: "my vote" })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request')
                })
        })
        test('404: responds with error message if article_id is valid but does not exist', () => {
            return request(app)
                .patch('/api/articles/999')
                .send({ inc_votes: 1 })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Request not found');
                })
        })
        test('400: responds with error message if article_id is invalid', () => {
            return request(app)
                .patch('/api/articles/IamNotAnId')
                .expect(400)
                .send({ inc_votes: 1 })
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request');
                })
        })
    })

    describe('DELETE /api/comments/:comment_id', () => {
        test('204: deletes comment using comment_id and responds with error message', () => {
            return request(app)
                .delete('/api/comments/1')
                .expect(204)
        })
        test('400: responds with 400 error message if comment_id is invalid', () => {
            return request(app)
                .delete('/api/comments/iamnotacommentid')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request')
                })
        })
    })

    describe('GET /api/users', () => {
        test('200: responds with an array of objects containing properties for each user', () => {
            return request(app)
                .get('/api/users')
                .expect(200)
                .then(({ body }) => {
                    expect(body.rows.length).toBeGreaterThan(1)
                    body.rows.forEach((user) => {
                        expect(user).toHaveProperty("username", expect.any(String));
                        expect(user).toHaveProperty("name", expect.any(String));
                        expect(user).toHaveProperty("avatar_url", expect.any(String));
                    })
                })
        })

    })

    describe('GET /api/articles (sorting queries)', () => {
        test('200: responds with array of article objects sorted by default sort_by query - created_at', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("created_at", { descending: true });
                })
        })
        test('200: responds with array of article objects using author sort_by query', () => {
            return request(app)
                .get('/api/articles?sort_by=author')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("author", { descending: false });
                })
        })
    })
});


