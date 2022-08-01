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
                expect(Object.keys(body.categories[0])).toEqual(["slug", "description"]);
            });
    });
});

