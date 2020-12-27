const redisService = require("../services/redis.service");

/**
 * Creates a middleware controller that performs the cache operations: INSERT
 * and FETCH. The controller has a set of middleware functions as properties
 * with each having access to an HTTP request object, an HTTP response object,
 * and an optional callback function that's used in the middleware function if
 * it does not end the express router's request-response cycle.
 * @returns The middleware controller that performs a set of cache operations.
 * @author Amr ElShafei
 * @since 01/12/2020
 */
function createController() {
  // Create the controller.
  const controller = {
    /**
     * The cache controller's INSERT middleware function.
     * @param {any} req An object representing the HTTP request for the INSERT
     * middleware function.
     * @param {any} res An object representing the HTTP response for the INSERT
     * middleware function.
     * @author Amr ElShafei
     * @since 01/12/2020
     */
    insert: function (req, res) {
      const key = req.url;
      redisService.setex(key, 20, JSON.stringify(res.locals.result));
      console.log(`[CACHING LOG] data cached with key ${key}`);
    },

    /**
     * The cache controller's FETCH middleware function.
     * @param {any} req An object representing the HTTP request for the FETCH
     * middleware function.
     * @param {any} res An object representing the HTTP response for the FETCH
     * middleware function.
     * @param {() => void} next A callback argument for the FETCH middleware
     * function.
     * @author Amr ElShafei
     * @since 01/12/2020
     */
    fetch: function (req, res, next) {
      const key = req.url;
      redisService.get(key, (err, data) => {
        if (err) res.send(err);
        if (data !== null) {
          res.send(JSON.parse(data));
          console.log(`[CACHING LOG] data fetched from key ${key}`);
        } else {
          if (next) next();
        }
      });
    },
  };
  // Return the controller.
  return controller;
}

/**
 * The middleware controller that performs a set of cache operations.
 */
const controller = createController();

module.exports = controller;
