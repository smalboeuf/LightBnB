const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  
  const values = [email];
  const queryString = `SELECT * FROM users
  WHERE users.email = $1`

  return pool.query(queryString, values)
  .then(res => {
    return res.rows[0];
  });
  
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const values = [id];
  const queryString = `SELECT * FROM users
  WHERE users.id = $1`;

  return pool.query(queryString, values)
  .then(res => {
    return res.rows[0];
  });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const values = [`${user.name}`, `${user.email}`, `${user.password}`];
  const queryString = `
  INSERT INTO users (name, email, password) 
  VALUES ($1, $2, $3)
  RETURNING *;`
  
  return pool.query(queryString, values)
  .then(res => res.rows[0]);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  const values = [guest_id];
  const queryString = `
  SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT 10;`

  return pool.query(queryString, values)
  .then( res => {
    return res.rows;
  }
  );
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

 // 1
 const queryParams = [];
 // 2
 let queryString = `
 SELECT properties.*, avg(property_reviews.rating) as average_rating
 FROM properties
 LEFT JOIN property_reviews ON properties.id = property_id
 `;

 console.log(options);
 // 3
 if (options.city) {
   queryParams.push(`%${options.city}%`);
   queryString += ` WHERE city LIKE $${queryParams.length}`;
 }


 console.log(queryParams.length);

if(options.owner_id) {
  
 queryParams.push(Number(options.owner_id));

 if (queryParams.length > 0) {
   queryString += ` AND properties.owner_id = $${queryParams.length}`
 } else {
   queryString += ` WHERE properties.owner_id = $${queryParams.length}`
 }

}

if (options.minimum_price_per_night && options.maximum_price_per_night) {
  queryParams.push(Number(options.minimum_price_per_night));
  queryParams.push(Number(options.maximum_price_per_night));

  if (queryParams.length > 0) {
    queryString += ` AND properties.cost_per_night >= $${queryParams.length - 1}`;
    queryString += ` AND properties.cost_per_night <= $${queryParams.length}`;
  } else {
    queryString += ` WHERE properties.cost_per_night >= $${queryParams.length - 1} AND properties.cost_per_night <= $${queryParams.length}`;
  }
} 



 // 4

 queryString += `
 GROUP BY properties.id`;

 if (options.minimum_rating) {
  queryParams.push(Number(options.minimum_rating));

  if (queryParams.length > 0) {
    queryString += ` HAVING avg(property_reviews.rating) >= $${queryParams.length}`
  } else {
    queryString += ` WHERE HAVING avg(property_reviews.rating) >= $${queryParams.length}`
  }

}
queryParams.push(limit);
queryString += ` ORDER BY cost_per_night LIMIT $${queryParams.length}; `;


 // 5
 console.log(queryString, queryParams);

 // 6
 return pool.query(queryString, queryParams)
 .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  console.log(property);
  const values = 
  [property.owner_id,
  property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url,property.cost_per_night,property.parking_spaces,property.number_of_bathrooms,property.number_of_bedrooms,property.country,property.street,property.city,property.province,property.post_code];
  const queryString = `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms,number_of_bedrooms, country, street, city, province, post_code) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;`;

  return pool.query(queryString, values)
  .then(res => res.rows[0]);

}
exports.addProperty = addProperty;
