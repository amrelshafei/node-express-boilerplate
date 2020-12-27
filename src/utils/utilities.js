/**
 * Restructures an HTTP request query object by breaking it into five main
 * components that can be used to perform efficient query operations such as
 * filtering, projecting, sorting, and paging.
 * @param {Object} query An HTTP request query object that is originally
 * retrieved from the route query string.
 * @returns {Object} A restructured object containing all the main query
 * components.
 * @author Amr ElShafei
 * @since 01/12/2020
 */
function conformQuery(query) {
  // 1. Seperate the filtering query from the main query string in order to
  // create an object that stores all the conditions needed to filter the
  // MongoDB documents.
  let filter = removeProperties(query, [
    "_sort",
    "_projection",
    "_limit",
    "_page",
  ]);
  // 2. This loop traverses through any filter condition that contains a
  // comparison operation in order to decode the condition into its final
  // format.
  for (const [path, operation] of Object.entries(copyObject(filter))) {
    const operators = [
      "eq",
      "ne",
      "gt",
      "gte",
      "lt",
      "lte",
      "regex",
      "in",
      "nin",
    ];
    if (
      typeof operation === "string" &&
      new RegExp(operators.join(":|") + ":").test(operation)
    ) {
      filter[path] = restructureOperation(operation);
    }
  }
  // 3. Return the restructured object, ready for performing resource
  // projection, sorting, and pagination.
  const conformedQuery = {
    filter: filter,
    sort: query._sort || null,
    projection: query._projection || null,
    limit: Number(query._limit) || 20,
    page: Number(query._page) || 0,
  };
  return conformedQuery;
}

/**
 *
 * @param {*} object
 * @param {*} keys
 * @author Amr ElShafei
 * @since 01/12/2020
 */
function removeProperties(object, keys) {
  return Object.keys(object).reduce((filtered, key) => {
    if (!keys.includes(key)) filtered[key] = object[key];
    return filtered;
  }, {});
}

/**
 *
 * @param {*} object
 * @author Amr ElShafei
 * @since 01/12/2020
 */
function copyObject(object) {
  return Object.assign({}, object);
}

/**
 *
 * @param {*} conformedQuery
 * @author Amr ElShafei
 * @since 01/12/2020
 */
function stringifyConformedQuery(conformedQuery) {
  const stringified = Object.entries(
    removeProperties(conformedQuery, ["filter"])
  )
    .map((entry) => {
      return entry[1] !== null ? entry.join("=") : "";
    })
    .filter((entry) => entry !== "")
    .join("&");
  return stringified;
}

/**
 *
 * @param {*} operation
 * @author Amr ElShafei
 * @since 01/12/2020
 */
function restructureOperation(operation) {
  const operators = [
    "eq",
    "ne",
    "gt",
    "gte",
    "lt",
    "lte",
    "regex",
    operation.includes("nin:") ? "nin" : "in",
  ];
  var list = [operation];
  operators.forEach((operator) => {
    var basket = [];
    list.forEach((element) => {
      const split = element.split(`${operator}:`);
      basket = [
        ...basket,
        ...[split.shift(), ...split.map((splited) => `${operator}:${splited}`)],
      ];
    });
    list = basket;
  });
  list.shift();
  list = list.map((element, index) => {
    if (index < list.length - 1) return element.substr(0, element.length - 1);
    else return element;
  });
  var object = {};
  list.forEach((element) => {
    const operator = element.split(":", 2)[0];
    const value = element.split(":", 2)[1];
    object[`$${operator}`] =
      operator === "in" || operator === "nin" ? value.split(",") : value;
  });
  return object;
}

/**
 *
 * @param {*} resourceUrl
 * @param {*} query
 * @param {*} page
 * @param {*} total
 * @param {*} limit
 * @author Amr ElShafei
 * @since 01/12/2020
 */
function generatePaging(resourceUrl, query, page, total, limit) {
  return {
    first: `${resourceUrl}?${stringifyConformedQuery({ ...query, _page: 0 })}`,
    prev:
      page > 0
        ? `${resourceUrl}?${stringifyConformedQuery({
            ...query,
            _page: page - 1,
          })}`
        : "",
    self: `${resourceUrl}?${stringifyConformedQuery(query)}`,
    next:
      page < Math.floor(total / limit)
        ? `${resourceUrl}?${stringifyConformedQuery({
            ...query,
            _page: page + 1,
          })}`
        : "",
    last: `${resourceUrl}?${stringifyConformedQuery({
      ...query,
      _page: Math.floor(total / limit),
    })}`,
  };
}

module.exports = {
  removeProperties: removeProperties,
  copyObject: copyObject,
  conformQuery: conformQuery,
  stringifyConformedQuery: stringifyConformedQuery,
  restructureOperation: restructureOperation,
  generatePaging: generatePaging,
};
