const testData = require('../db/data/test-data');
const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');

afterAll(() => {
    if (db.end) return db.end();
});

beforeEach (() => seed(testData));

describe('GET /api', () => {
    test('responds with all available endpoints', () => {
        request(app).get('/api').expect(200)
            .then(({body}) => {
                expect(body.apis["GET /api"]).toEqual(expect.any(Object));
                expect(body.apis["GET /api/categories"]).toEqual(expect.any(Object));
                expect(body.apis["GET /api/reviews"]).toEqual(expect.any(Object));
                expect(body.apis["GET /api/reviews/:review_id"]).toEqual(expect.any(Object));
                expect(body.apis["PATCH /api/reviews/:review_id"]).toEqual(expect.any(Object));
                expect(body.apis["GET /api/users"]).toEqual(expect.any(Object));
                expect(body.apis["GET /api/reviews/:review_id/comments"]).toEqual(expect.any(Object));
                expect(body.apis["POST /api/reviews/:review_id/comments"]).toEqual(expect.any(Object));
                expect(body.apis["DELETE /api/comments/:comment_id"]).toEqual(expect.any(Object));
            });
    });
});

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
    });
    test('status: 400 for invalid review_id provided', () => {
        return request(app).patch('/api/reviews/bananas').expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
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
    });
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
                expect(body.reviews.length).toBe(10);
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
                });
            });
    });
    test('status 200: should accept sort_by query', () => {
        return request(app).get('/api/reviews?sort_by=owner').expect(200)
            .then(({body}) => {
                expect(body.reviews).toBeSortedBy('owner', {descending: true});
            });
    });
    test('status: 400 for invalid sort_by value', () => {
        return request(app).get('/api/reviews?sort_by=banana').expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('status: 200 can change the order to ASC/DESC', () => {
        return request(app).get('/api/reviews?order=ASC').expect(200)
            .then(({body}) => {
                expect(body.reviews).toBeSortedBy('created_at');
            });
    });
    test('status: 400 for invalid order value', () => {
        return request(app).get('/api/reviews?order=banana').expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('status: 200 can refine by category', () => {
        return request(app).get('/api/reviews?category=euro+game').expect(200)
            .then(({body}) => {
                expect(body.reviews).toHaveLength(1);
                body.reviews.forEach(review => {
                    expect(review.category).toBe("euro game")
                })
            });
    });
    test('status: 404 for category not found', () => {
        return request(app).get('/api/reviews?category=banana').expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("not found");
            });
    });
    test('responds with status: 200 and an empty array for valid and existent category but no data', () => {
        return request(app).get("/api/reviews/?category=children's+games").expect(200)
            .then(({body}) => {
                expect(body.reviews).toHaveLength(0);
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
    test('status: 404 for user not found', () => {
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

describe('DELETE /api/comments/:comment_id', () => {
    test('responds with status: 204 removing the correct comment and returns no content', () => {
        return request(app).delete('/api/comments/1').expect(204)
            .then(({body}) => {
                expect(body).toEqual({});
            });
    });
    test('status: 400 for invalid comment_id', () => {
        return request(app).delete('/api/comments/banana').expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request")
            });
    });
    test('status 404 for valid but non existent comment_id', () => {
        return request(app).delete('/api/comments/7777').expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("not found");
            });
    });
});

describe('GET /api/users/:username', () => {
    test('responds with status: 200 and a single object refined by "username"', () => {
        return request(app).get('/api/users/mallionaire').expect(200)
            .then(({body}) => {
                expected = {
                    username: 'mallionaire',
                    name: 'haz',
                    avatar_url:
                      'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                  };
                expect(body.user).toEqual(expected);
            });
    });
    test('status: 404 for username not found', () => {
        return request(app).get('/api/users/gandolfini').expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("not found");
            });
    });
    test('new endpoint added to GET /api', () => {
        request(app).get('/api').expect(200)
            .then(({body}) => {
                    expect(body.apis["GET /api/users/:username"]).toEqual(expect.any(Object));
            });
    });
});

describe('PATCH /api/comments/:comment_id', () => {
    const input = {inc_vote: 2};
    test('status: 200 and responds with the selected comment and with the vote value incremented by the passed value', () => {
        const expected = {
            comment_id: 1,
            body: 'I loved this game too!',
            votes: 18,
            author: 'bainesface',
            review_id: 2,
            created_at: expect.any(String)
        };
        return request(app).patch('/api/comments/1').send(input).expect(200)
            .then(({body}) => {
                expect(body.comment).toEqual(expected);
            });
    });
    test('status: 400 for invalid comment_id', () => {
        return request(app).patch('/api/comments/banana').send(input).expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('status: 404 for valid but non existent comment_id', () => {
        return request(app).patch('/api/comments/7777').send(input).expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("not found");
            });
    });
    test('status: 400 for invalid key sent', () => {
        const badInput = {in_vote: 2};
        return request(app).patch('/api/comments/1').send(badInput).expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('status: 400 for invalid value sent', () => {
        const badInput2 = {in_vote: "banana"};
        return request(app).patch('/api/comments/1').send(badInput2).expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('new endpoint added to GET /api', () => {
        request(app).get('/api').expect(200)
            .then(({body}) => {
                    expect(body.apis["PATCH /api/comments/:comment_id"]).toEqual(expect.any(Object));
            });
    });
});

describe('POST /api/reviews', () => {
    input = {
        owner: "mallionaire",
        title: "Terraforming Mars",
        review_body: "My favourite game!",
        designer: "Jacob Fryxelius",
        category: "euro game"
    };
    test('responds with status: 201, accepts a new review object and returns the added review', () => {
        expected = {
            review_id: 14,
            owner: "mallionaire",
            review_img_url: expect.any(String),
            title: "Terraforming Mars",
            review_body: "My favourite game!",
            designer: "Jacob Fryxelius",
            category: "euro game",
            created_at: expect.any(String),
            votes: 0
        };
        return request(app).post('/api/reviews').send(input).expect(201)
            .then(({body}) => {
                expect(body.review).toEqual(expected);
            });
    });
    test('responds with status: 400 for invalid key', () => {
        input = {
            ower: "mallionaire",
            title: "Terraforming Mars",
            review_body: "My favourite game!",
            designer: "Jacob Fryxelius",
            category: "euro game"
        };
        return request(app).post('/api/reviews').send(input).expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('responds with status: 400 for invalid value', () => {
        input = {
            ower: "mallionaire",
            title: "Terraforming Mars",
            review_body: "My favourite game!",
            designer: 777,
            category: "euro game"
        };
        return request(app).post('/api/reviews').send(input).expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('responds with status: 404 for username or category not found', () => {
        input = {
            owner: "gandolfini",
            title: "Terraforming Mars",
            review_body: "My favourite game!",
            designer: 'Jacob Fryxelius',
            category: "euro game"
        };
        return request(app).post('/api/reviews').send(input).expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("value not found");
            });
    });
    test('new endpoint added to GET /api', () => {
        request(app).get('/api').expect(200)
            .then(({body}) => {
                    expect(body.apis["POST /api/reviews"]).toEqual(expect.any(Object));
            });
    });
});

describe('GET /api/reviews using pagination', () => {
    test('responds with status: 200 and a list of 5 results on page 1', () => {
        return request(app).get('/api/reviews?p=1&limit=5').expect(200)
            .then(({body}) => {
                expect(body.reviews).toHaveLength(5);
            });
    });
    test('responds with status: 200 and a list of 5 results on page 2', () => {
        return request(app).get('/api/reviews?p=2&limit=5').expect(200)
            .then(({body}) => {
                expect(body.reviews).toHaveLength(5);
            });
    });
    test('responds with status: 200 and a list of 3 results on page 3', () => {
        return request(app).get('/api/reviews?p=3&limit=5').expect(200)
            .then(({body}) => {
                expect(body.reviews).toHaveLength(3);
            });
    });
    test('responds with status: 200 and a list of 10 results on page 1 if no limit is set', () => {
        return request(app).get('/api/reviews?p=1').expect(200)
            .then(({body}) => {
                expect(body.reviews).toHaveLength(10);
            });
    });
    test('responds with status: 200 and a list of 3 results on page 2 if no limit is set', () => {
        return request(app).get('/api/reviews?p=2').expect(200)
            .then(({body}) => {
                expect(body.reviews).toHaveLength(3);
            });
    });
    test('status: 400 for invalid "p" value', () => {
        return request(app).get('/api/reviews?p=banana').expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('status: 400 for invalid "limit" value', () => {
        return request(app).get('/api/reviews?limit=banana').expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    // test('responds with status: 200 and response includes a total_count of all reviews', () => {
    //     return request(app).get('/api/reviews?p=1').expect(200)
    //         .then(({body}) => {
    //             body.reviews.forEach((review) => {
    //                 expect(review.total_count).toBe(13);
    //             });
    //         });
    // });
    // test('responds with status: 200 and response includes a total_count of all reviews refined by category', () => {
    //     return request(app).get('/api/reviews?p=1&category=social+deduction&limit=2&sort_by=review_id&order=ASC').expect(200)
    //         .then(({body}) => {
    //             body.reviews.forEach((review) => {
    //                 expect(review.total_count).toBe(11);
    //             });
    //         });
    // });
});

describe('GET /api/reviews/:review_id/comments using pagination', () => {
    test('responds with status: 200 and a list of 2 results on page 1', () => {
        return request(app).get('/api/reviews/2/comments?p=1&limit=2').expect(200)
            .then(({body}) => {
                expect(body.comments).toHaveLength(2);
            });
    });
    test('responds with status: 200 and a list of 1 results on page 1', () => {
        return request(app).get('/api/reviews/2/comments?p=2&limit=2').expect(200)
            .then(({body}) => {
                expect(body.comments).toHaveLength(1);
            });
    });
    test('status: 400 for invalid "p" value', () => {
        return request(app).get('/api/reviews/2/comments?p=banana').expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('status: 400 for invalid "limit" value', () => {
        return request(app).get('/api/reviews?limit=banana').expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
});

describe('POST /api/categories', () => {
    const input = {
        "slug": "deck builder",
        "description": "a card game where you start with a basic deck and increase its strength over time"
      };
    test('responds with status: 201 and the added category', () => {
        const expected = {
            slug: "deck builder",
            description: "a card game where you start with a basic deck and increase its strength over time"
          };
        return request(app).post('/api/categories').send(input).expect(201)
            .then(({body}) => {
                expect(body.category).toEqual(expected);
            });
    });
    test('status: 400 for invalid key', () => {
        const input = {
            slug: "deck builder",
            dezcription: "a card game where you start with a basic deck and increase its strength over time"
          };
        return request(app).post('/api/categories').send(input).expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('new endpoint added to GET /api', () => {
        request(app).get('/api').expect(200)
            .then(({body}) => {
                    expect(body.apis["POST /api/categories"]).toEqual(expect.any(Object));
            });
    });
});

describe('DELETE /api/reviews/:review_id', () => {
    test('responds with status: 204 and no body', () => {
        return request(app).delete('/api/reviews/1').expect(204);
    });
    test('status: 400 for invalid review_id', () => {
        return request(app).delete('/api/reviews/banana').expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test('status: 404 for valid but non existent review_id', () => {
        return request(app).delete('/api/reviews/7777').expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("review_id not found");
            });
    });
    test('new endpoint added to GET /api', () => {
        request(app).get('/api').expect(200)
            .then(({body}) => {
                    expect(body.apis["DELETE /api/reviews/:review_id"]).toEqual(expect.any(Object));
            });
    });
});