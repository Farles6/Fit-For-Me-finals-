const db = require("../configs/db.config");

const authenticate = (email, password, cb) => {
	const query = `
    SELECT * FROM users WHERE email = $1`;
	const value = [email];
	return db
		.query(query, value)
		.then(res => {
			if (cb(password, res.rows[0].password)) {
				return res.rows[0];
			}
			return false;
		})
		.catch(err => console.log(err.message));
};

const getEmail = (email) => {
	const queryStringEmail = `SELECT *
  FROM users
  WHERE email = $1
  `;
	const values = [email];
	return db.query(queryStringEmail, values)
		.then(result => result.rows[0]);
};

const addUser = (name, email, password) => {
	const queryString = `INSERT INTO users (name, email, password)
VALUES(
$1, $2, $3) RETURNING *`;
	return db.query(queryString, [name, email, password]);
};

const getAllUsers = () => {
	return db.query(`SELECT * FROM users`);
};

module.exports = { authenticate, getEmail, addUser, getAllUsers };
