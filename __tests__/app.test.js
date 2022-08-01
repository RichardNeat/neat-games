const testData = require('../db/data/test-data');
const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');

afterAll(() => {
    if (db.end) return db.end();
});

beforeEach (() => seed(testData));

describe('GET /api/nonsense', () => {
    test('handles all bad URL entries', () => {
        return request(app).get('/api/nonsense').expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("bad path");
        });
    });
});

describe('GET /api/categories', () => {
    test('responds with status: 200 and an object containing an array of objects each with the keys "slug" and "description"', () => {
        return request(app).get('/api/categories').expect(200)
            .then(({body}) => {
                expect(body).toBeInstanceOf(Object);
                expect(Array.isArray(body.categories)).toBe(true);
                expect(body.categories.length).toBe(4);
                body.categories.forEach(category => {
                    expect(category).toMatchObject({
                        description: expect.any(String),
                        slug: expect.any(String)
                    });
                });
            });
    });
});

describe('GET /api/reviews/:review_id', () => {
    test('responds with status: 200 and an object containing the correct keys and content', () => {
        return request(app).get('/api/reviews/1').expect(200)
            .then(({body}) => {
                expect(body).toBeInstanceOf(Object);
                expect(body.review).toBeInstanceOf(Object);
                expect(body.review).toMatchObject({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    votes: expect.any(Number),
                    category: expect.any(String),
                    owner: expect.any(String),
                    created_at: expect.any(String),
                });
            });
    });
    test('status: 400 for invalid review_id provided', () => {
        return request(app).get('/api/reviews/bananas').expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('status: 404 for valid but non existent review_id', () => {
        return request(app).get('/api/reviews/77777').expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("not found");
            });
    });
});
