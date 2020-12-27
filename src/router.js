const express = require("express");
const pluralize = require("mongoose-legacy-pluralize");
const redisController = require("./controllers/redis.controller");
const mongodbController = require("./controllers/mongodb.controller");
const mongodbService = require("./services/mongodb.service");

/**
 * Creates the router associated with the given resource name and adds all the
 * necessary middleware functions to it.
 * @param {string} name The resource name.
 * @returns The router associated with the given resource name.
 * @author Amr ElShafei
 * @since 01/12/2020
 */
function createResourceRouter(name) {
  // Creating the router associated with the given endpoint path.
  var router = express.Router();
  // Setting up resource path.
  const path = `/resources/${name}`;
  // Setting up the router's CREATE operation.
  router.post(path, mongodbController.create);
  // Setting up the router's READ operations.
  router.get(
    path,
    redisController.fetch,
    mongodbController.read,
    redisController.insert
  );
  router.get(
    `${path}/:id`,
    redisController.fetch,
    mongodbController.readById,
    redisController.insert
  );
  // Setting up the router's UPDATE operations.
  router.put(path, mongodbController.update);
  router.put(`${path}/:id`, mongodbController.updateById);
  // Setting up the router's DELETE operations.
  router.delete(path, mongodbController.delete);
  router.delete(`${path}/:id`, mongodbController.deleteById);
  // Returning the resource router with CRUD operations setup.
  return router;
}

/**
 * Creates the main router that encapsulates all the API middleware functions.
 * @returns The main router that encapsulates all the API middleware functions.
 * @author Amr ElShafei
 * @since 01/12/2020
 */
function createAPIRouter() {
  const router = express.Router();
  Object.values(mongodbService.models).forEach((model) => {
    router.use("/api", createResourceRouter(pluralize(model.modelName)));
  });
  return router;
}

module.exports = { createAPIRouter };
