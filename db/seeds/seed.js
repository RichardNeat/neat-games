const db = require("../connection");

const seed = async (data) => {
	const { categoryData, commentData, reviewData, userData } = data;
	await db.query(`DROP TABLE IF EXISTS comments;`);
	await db.query(`DROP TABLE IF EXISTS reviews;`);
	await db.query(`DROP TABLE IF EXISTS users;`);
	await db.query(`DROP TABLE IF EXISTS categories;`);

	const topicsTablePromise = db.query(`
  CREATE TABLE categories (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR
  );`);

	const usersTablePromise = db.query(`
  CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    avatar_url VARCHAR
  );`);

	await Promise.all([topicsTablePromise, usersTablePromise]);

	await db.query(`
  CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    category VARCHAR NOT NULL REFERENCES categories(slug),
    designer VARCHAR,
    owner VARCHAR NOT NULL REFERENCES users(username),
    review_body VARCHAR NOT NULL,
    review_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
    created_at TIMESTAMP DEFAULT NOW(),
    votes INT DEFAULT 0 NOT NULL
  );`);

	await db.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    body VARCHAR NOT NULL,
    review_id INT REFERENCES reviews(review_id) NOT NULL,
    author VARCHAR REFERENCES users(username) NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`);
};

module.exports = seed;
