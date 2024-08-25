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
    
    
})