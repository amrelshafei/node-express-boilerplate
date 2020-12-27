const pluralize = require("mongoose-legacy-pluralize");
const mongodbService = require("../services/mongodb.service");
const { conformQuery, generatePaging } = require("../utils/utilities");

/**
 * Creates a middleware controller that performs the CRUD operations: CREATE,
 * READ, UPDATE and DELETE. The controller has a set of middleware functions as
 * properties with each having access to an HTTP request object, an HTTP
 * response object, and an optional callback function that's used in the
 * middleware function if it does not end the express router's request-response
 * cycle.
 * @returns The middleware controller that performs a set of CRUD operations.
 * @author Amr ElShafei
 * @since 01/12/2020
 */
function createController() {
  // Create the controller.
  const controller = {
    /**
     * The database controller's CREATE middleware function.
     * @param {any} req An object representing the HTTP request for the CREATE
     * middleware function.
     * @param {any} res An object representing the HTTP response for the CREATE
     * middleware function.
     * @param {() => void} next A callback argument for the CREATE middleware
     * function.
     * @author Amr ElShafei
     * @since 01/12/2020
     */
    create: function (req, res, next) {
      const model = findModel(req.route.path);
      const document = new model(req.body);
      document
        .validate()
        .then(function () {
          document
            .save()
            .then(function (result) {
              res.send(result);
              next();
            })
            .catch(function (err) {
              res.send(err);
            });
        })
        .catch(function (err) {
          res.send(err);
        });
    },

    /**
     * The database controller's READ middleware function.
     * @param {any} req An object representing the HTTP request for the READ
     * middleware function.
     * @param {any} res An object representing the HTTP response for the READ
     * middleware function.
     * @param {() => void} next A callback argument for the READ middleware
     * function.
     * @author Amr ElShafei
     * @since 01/12/2020
     */
    read: function (req, res, next) {
      const model = findModel(req.route.path);
      const { filter, sort, projection, limit, page } = conformQuery(req.query);
      const resourceUrl = `http://${req.headers.host}${req.originalUrl}`;
      model
        .find(filter)
        .sort(sort)
        .select(projection)
        .limit(limit)
        .skip(page * limit)
        .then(function (result) {
          model
            .countDocuments(filter)
            .then(function (total) {
              const conformedResult = {
                _links: generatePaging(
                  resourceUrl,
                  req.query,
                  page,
                  total,
                  limit
                ),
                _count: result.length,
                _total: total,
                _result: result,
              };
              res.locals.result = conformedResult;
              res.send(conformedResult);
              next();
            })
            .catch(function (err) {
              res.send(err);
            });
        })
        .catch(function (err) {
          res.send(err);
        });
    },

    /**
     * The database controller's READ-by-id middleware function.
     * @param {any} req An object representing the HTTP request for the
     * READ-by-id middleware function.
     * @param {any} res An object representing the HTTP response for the
     * READ-by-id middleware function.
     * @param {() => void} next A callback argument for the READ-by-id
     * middleware function.
     * @author Amr ElShafei
     * @since 01/12/2020
     */
    readById: function (req, res, next) {
      const model = findModel(req.route.path);
      const id = req.params.id;
      const { projection } = conformQuery(req.query);
      model
        .findById(id)
        .select(projection)
        .then(function (result) {
          res.locals.result = result;
          res.send(result);
          next();
        })
        .catch(function (err) {
          res.send(err);
        });
    },

    /**
     * The database controller's UPDATE middleware function.
     * @param {any} req An object representing the HTTP request for the UPDATE
     * middleware function.
     * @param {any} res An object representing the HTTP response for the UPDATE
     * middleware function.
     * @param {() => void} next A callback argument for the UPDATE middleware
     * function.
     * @author Amr ElShafei
     * @since 01/12/2020
     */
    update: function (req, res, next) {
      const model = findModel(req.route.path);
      const { filter } = conformQuery(req.query);
      const update = req.body;
      model
        .updateMany(filter, update)
        .then(function (result) {
          res.send(result);
          next();
        })
        .catch(function (err) {
          res.send(err);
        });
    },

    /**
     * The database controller's UPDATE-by-id middleware function.
     * @param {any} req An object representing the HTTP request for the
     * UPDATE-by-id middleware function.
     * @param {any} res An object representing the HTTP response for the
     * UPDATE-by-id middleware function.
     * @param {() => void} next A callback argument for the UPDATE-by-id
     * middleware function.
     * @author Amr ElShafei
     * @since 01/12/2020
     */
    updateById: function (req, res, next) {
      const model = findModel(req.route.path);
      const id = req.params.id;
      const update = req.body;
      model
        .findByIdAndUpdate(id, update)
        .then(function (result) {
          res.send(result);
          next();
        })
        .catch(function (err) {
          res.send(err);
        });
    },

    /**
     * The database controller's DELETE middleware function.
     * @param {any} req An object representing the HTTP request for the DELETE
     * middleware function.
     * @param {any} res An object representing the HTTP response for the DELETE
     * middleware function.
     * @param {() => void} next A callback argument for the DELETE middleware
     * function.
     * @author Amr ElShafei
     * @since 01/12/2020
     */
    delete: function (req, res, next) {
      const model = findModel(req.route.path);
      const { filter } = conformQuery(req.query);
      model
        .deleteMany(filter)
        .then(function (result) {
          res.send(result);
          next();
        })
        .catch(function (err) {
          res.send(err);
        });
    },

    /**
     * The database controller's DELETE-by-id middleware function.
     * @param {any} req An object representing the HTTP request for the
     * DELETE-by-id middleware function.
     * @param {any} res An object representing the HTTP response for the
     * DELETE-by-id middleware function.
     * @param {() => void} next A callback argument for the DELETE-by-id
     * middleware function.
     * @author Amr ElShafei
     * @since 01/12/2020
     */
    deleteById: function (req, res, next) {
      const model = findModel(req.route.path);
      const id = req.params.id;
      model
        .findByIdAndDelete(id)
        .then(function (result) {
          res.send(result);
          next();
        })
        .catch(function (err) {
          res.send(err);
        });
    },
  };
  return controller;
}

/**
 * Finds the model associated with the given resource path.
 * @param {string} resourcePath The resource path.
 * @returns The model associated with the given resource path.
 * @author Amr ElShafei
 * @since 01/12/2020
 */
function findModel(resourcePath) {
  const parsed = resourcePath.split("/");
  const resourceName = parsed[parsed.indexOf("resources") + 1];
  return Object.values(mongodbService.models).find(
    (model) => pluralize(model.modelName) === resourceName
  );
}

/**
 * The middleware controller that performs a set of CRUD operations.
 */
const controller = createController();

module.exports = controller;
