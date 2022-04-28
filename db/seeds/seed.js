const db = require("../connection");
const format = require("pg-format");
const {
	convertTimestampToDate,
	createRef,
	formatComments,
} = require("./utils");

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

	const insertCategoriesQueryStr = format(
		"INSERT INTO categories (slug, description) VALUES %L RETURNING *;",
		categoryData.map(({ slug, description }) => [slug, description])
	);

	const categoriesPromise = db
		.query(insertCategoriesQueryStr)
		.then((result) => result.rows);

	const insertUsersQueryStr = format(
		"INSERT INTO users ( username, name, avatar_url) VALUES %L RETURNING *;",
		userData.map(({ username, name, avatar_url }) => [
			username,
			name,
			avatar_url,
		])
	);
	const usersPromise = db
		.query(insertUsersQueryStr)
		.then((result) => result.rows);

	await Promise.all([categoriesPromise, usersPromise]);

	const formattedReviewData = reviewData.map(convertTimestampToDate);

	const insertReviewsQueryStr = format(
		"INSERT INTO reviews (title, category, designer, owner, review_body, review_img_url, created_at, votes) VALUES %L RETURNING *;",
		formattedReviewData.map(
			({
				title,
				category,
				designer,
				owner,
				review_body,
				review_img_url,
				created_at,
				votes,
			}) => [
				title,
				category,
				designer,
				owner,
				review_body,
				review_img_url,
				created_at,
				votes,
			]
		)
	);

	const reviewRows = await db
		.query(insertReviewsQueryStr)
		.then((result) => result.rows);

	const reviewIdLookup = createRef(reviewRows, "title", "review_id");
	const formattedCommentData = formatComments(commentData, reviewIdLookup);

	const insertCommentsQueryStr = format(
		"INSERT INTO comments (body, author, review_id, votes, created_at) VALUES %L RETURNING *;",
		formattedCommentData.map(
			({ body, author, review_id, votes = 0, created_at }) => [
				body,
				author,
				review_id,
				votes,
				created_at,
			]
		)
	);

	return db.query(insertCommentsQueryStr).then((result) => {
		return result.rows;
	});
};

module.exports = seed;
