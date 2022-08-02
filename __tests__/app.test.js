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
        return request(app).get('/api/reviews/2').expect(200)
            .then(({body}) => {
                expect(body.review.review_id).toBe(2);
                expect(body.review.title).toEqual(expect.any(String));
                expect(body.review.designer).toEqual(expect.any(String));
                expect(body.review.owner).toEqual(expect.any(String));
                expect(body.review.review_img_url).toEqual(expect.any(String));
                expect(body.review.review_body).toEqual(expect.any(String));
                expect(body.review.category).toEqual(expect.any(String));
                expect(body.review.created_at).toEqual(expect.any(String));
                expect(body.review.votes).toEqual(expect.any(Number));
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

describe('PATCH /api/reviews/:review_id', () => {
    test('responds with status: 201 and and with the updated review incremeneted by the passed amount', () => {
        const input = {inc_votes: 2}
        const expected = {
            review_id: 1,
            title: 'Agricola',
            category: 'euro game',
            designer: 'Uwe Rosenberg',
            owner: 'mallionaire',
            review_body: 'Farmyard fun!',
            review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 3
          }
        return request(app).patch('/api/reviews/1').send(input).expect(200)
        .then(({body}) => {
            expect(body.review).toEqual(expected);
        });
    });
    test('responds with status: 201 and and with the updated review decremented by the passed amount', () => {
        const input = {inc_votes: -50}
        const expected = {
            review_id: 1,
            title: 'Agricola',
            category: 'euro game',
            designer: 'Uwe Rosenberg',
            owner: 'mallionaire',
            review_body: 'Farmyard fun!',
            review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            created_at: "2021-01-18T10:00:20.514Z",
            votes: -49
          }
        return request(app).patch('/api/reviews/1').send(input).expect(200)
        .then(({body}) => {
            expect(body.review).toEqual(expected);
        });
    })
    test('status: 400 for invalid review_id provided', () => {
        return request(app).patch('/api/reviews/bananas').expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    })
    test('status: 404 for valid but non existent review_id', () => {
        return request(app).patch('/api/reviews/77777').expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("review_id not found");
            });
    });
    test('status: 400 for invalid inc_votes value', () => {
        const input = {inc_votes: 'banana'};
        return request(app).patch('/api/reviews/1').send(input).expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("bad request");
        });
    })
    test('status: 400 for invalid inc_votes key such as inc_vote', () => {
        const input = {inc_vote: 'banana'};
        return request(app).patch('/api/reviews/1').send(input).expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("bad request");
        });
    });
});

describe('GET /api/reviews/:review_id amended to include "comment_count" key', () => {
    test('responds with status: 200 and an object containing the correct keys and content', () => {
        return request(app).get('/api/reviews/2').expect(200)
            .then(({body}) => {
                expect(body.review.review_id).toBe(2);
                expect(body.review.comment_count).toBe("3");

describe('GET /api/users', () => {
    test('responds with status: 200 and an array of objects containing the correct keys', () => {
        return request(app).get('/api/users').expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.users)).toBe(true);
                expect(body.users.length).toBe(4);
                body.users.forEach(user => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    });
                });
            });
    });
});