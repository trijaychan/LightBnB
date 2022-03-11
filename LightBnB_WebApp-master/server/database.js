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
  const queryString = `SELECT * FROM users WHERE email = $1;`
  const values = [email];

  return pool
    .query(queryString, values)
    .then(res => {
      if (res.rows) {
        return Promise.resolve(res.rows);
      } else {
        return null;
      }
    })
    .catch(err => {
      console.log(err);
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `SELECT * FROM users WHERE id = $1;`
  const values = [id];

  return pool
    .query(queryString, values)
    .then(res => {
      if (res.rows) {
        return Promise.resolve(res.rows);
      } else {
        return null;
      }
    })
    .catch(err => {
      console.log(err);
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const queryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
  const values = [user.name, user.email, user.password];

  return pool
    .query(queryString, values)
    .then(res => {
      if (res.rows) {
        return Promise.resolve(res.rows);
      } else {
        return null;
      }
    })
    .catch(err => {
      console.log(err);
    });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT reservations.*
  FROM reservations
  JOIN users on users.id = $1
  LIMIT $2;
  `;
  const values = [guest_id, limit];

  return pool
    .query(queryString, values)
    .then(res => {
      if (res.rows) {
        return Promise.resolve(res.rows);
      } else {
        return null;
      }
    })
    .catch(err => {
      console.log(err);
    });
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
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON property_id = properties.id
  `;
  const values = [];
  let whereBefore = false;

  if (options.city) {
    values.push(`%$${options.city}%`);
    queryString += `WHERE city LIKE $${values.length}`;
    whereBefore = true;
  }
  if (options.owner_id) {
    values.push(options.owner_id);
    if (whereBefore) {
      queryString += ` and owner_id = $${values.length}`;
    } else {
      queryString += `\nWHERE owner_id = $${values.length}`;
      whereBefore = true;
    }
  }
  if (options.minimum_price_per_night) {
    values.push(options.minimum_price_per_night * 100);
    if (whereBefore) {
      queryString += ` and cost_per_night >= $${values.length}`;
    } else {
      queryString += `\nWHERE cost_per_night >= $${values.length}`;
      whereBefore = true;
    }
  }
  if (options.maximum_price_per_night) {
    values.push(options.maximum_price_per_night * 100);
    if (whereBefore) {
      queryString += ` and cost_per_night <= $${values.length}`;
    } else {
      queryString += `\nWHERE cost_per_night <= $${values.length}`;
    }
  }
  queryString += "\nGROUP BY properties.id"
  if (options.minimum_rating) {
    values.push(options.minimum_rating);
    queryString += `\nHAVING avg(property_reviews.rating) >= $${values.length}`;
  }
  values.push(limit);
  queryString += `\nLIMIT $${values.length};`;

  console.log(queryString);

  return pool
    .query(queryString, values)
    .then(res => {
      if (res.rows) {
        return Promise.resolve(res.rows);
      } else {
        return null;
      }
    })
    .catch(err => {
      console.log(err);
    });
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
