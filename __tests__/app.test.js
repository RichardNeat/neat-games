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
            });
    });
});

describe('GET /api/users', () => {
    test('responds with status: 200 and an array of objects containing the correct keys', () => {
        return request(app).get('/api/users').expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.users)).toBe(true);
                expect(body.users.length).toBe(4);
                body.users.forEach(user => {
                    expect(user.username).toEqual(expect.any(String));
                    expect(user.name).toEqual(expect.any(String));
                    expect(user.avatar_url).toEqual(expect.any(String));
                });
            });
    });
});

describe('GET /api/reviews', () => {
    test('responds with status: 200 and an array of objects sorted in descending order by "created_at" date', () => {
        return request(app).get('/api/reviews').expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.reviews)).toEqual(true);
                expect(body.reviews.length).toBe(13);
                expect(body.reviews).toBeSortedBy('created_at', {descending: true});
                body.reviews.forEach(review => {
                    expect(review.title).toEqual(expect.any(String));
                    expect(review.designer).toEqual(expect.any(String));
                    expect(review.owner).toEqual(expect.any(String));
                    expect(review.review_img_url).toEqual(expect.any(String));
                    expect(review.category).toEqual(expect.any(String));
                    expect(review.created_at).toEqual(expect.any(String));
                    expect(review.votes).toEqual(expect.any(Number));
                    expect(review.comment_count).toEqual(expect.any(String));
                })
            });
    });
});

describe('GET /api/reviews/:review_id/comments', () => {
    test('responds with status: 200 and an array of comments for the given review_id with the correct keys', () => {
        return request(app).get('/api/reviews/2/comments').expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.comments)).toBe(true);
                expect(body.comments).toHaveLength(3);
                body.comments.forEach(comment => {
                    expect(comment.comment_id).toEqual(expect.any(Number));
                    expect(comment.votes).toEqual(expect.any(Number));
                    expect(comment.created_at).toEqual(expect.any(String));
                    expect(comment.author).toEqual(expect.any(String));
                    expect(comment.body).toEqual(expect.any(String));
                    expect(comment.review_id).toEqual(expect.any(Number));
                });
            });
    });
    test('responds with status: 200 and an empty array for valid and existent id but no data', () => {
        return request(app).get('/api/reviews/1/comments').expect(200)
            .then(({body}) => {
                expect(body.comments).toHaveLength(0);
            });
    });
    test('status: 400 for invalid review_id', () => {
        return request(app).get('/api/reviews/bananas/comments').expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('status: 404 for valid but non existent review_id', () => {
        return request(app).get('/api/reviews/7777/comments').expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("not found");
            })
    });
});

describe('POST /api/reviews/:review_id/comments', () => {
    const input = {
        username: 'mallionaire',
        body: "an Uwe classic!"
    };
    test('accepts a post and responds with status: 201 and the posted comment', () => {
        const expected = {
            comment_id: 7,
            author: 'mallionaire',
            body: "an Uwe classic!",
            votes: 0,
            review_id: 1,
            created_at: expect.any(String)
        };
        return request(app).post('/api/reviews/1/comments').send(input).expect(201)
            .then(({body}) => {
                expect(body.comment).toEqual(expected)
            });
    });
    test('status: 400 for invalid review_id', () => {
        return request(app).post('/api/reviews/bananas/comments').send(input).expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('status: 404 for valid but non existent review_id', () => {
        return request(app).post('/api/reviews/7777/comments').send(input).expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("value not found");
            });
    });
    test('status: 400 for invalid input key', () => {
        const input = {
            usernam: 'mallionaire',
            body: "an Uwe classic!"
        };
        return request(app).post('/api/reviews/1/comments').send(input).expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('status: 400 for user not found', () => {
        const input = {
            username: "gandolfini",
            body: "an Uwe classic!"
        };
        return request(app).post('/api/reviews/1/comments').send(input).expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("value not found");
            });
    });
});