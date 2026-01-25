// Shared TypeScript types and interfaces

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string} [avatar]
 * @property {Date} created_at
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} category
 * @property {string[]} images
 * @property {number} stock
 * @property {Object} [metadata]
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} user_id
 * @property {OrderItem[]} items
 * @property {number} total
 * @property {string} status
 * @property {Date} created_at
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} product_id
 * @property {number} quantity
 * @property {number} price
 */

export {};
