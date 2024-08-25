const db = require('../db/connection');
const app = require('../db/app');
const data = require('../db/data/test-data');
const request = require("supertest");
const seed = require("../db/seeds/seed");

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
                        console.log(topic)
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
        // test('204: returns error if no topics exist', () => {
        //     return request(app).get('/api/topics')
        //         .expect(204)
        //         .then(({ body }) => {
        //         expect(body.msg).toBe("No content found")
        //         })
        // })
    })
    
    describe('GET /api', () => {
        test('200: returns object with available endpoints', () => {
            return request(app).get('/api')
                .expect(200)
                .then(({ body }) => {
                    console.log(body, '<---body in test')
                    Object.keys(body).filter((endpoint) => {
                        console.log(endpoint, "<---enpoint")
                        expect(endpoint).toMatch("GET /api" || "GET /api/topics" || "GET /api/articles")
                    })
                })
        })
    })


})