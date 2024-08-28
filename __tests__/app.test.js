const db = require('../db/connection');
const app = require('../db/app');
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
            .then(({body}) => {
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
            .then(({body}) => {
                expect(body.articles).toBeSortedBy("created_at", {descending: true});
            });
        });
    });
    
});
