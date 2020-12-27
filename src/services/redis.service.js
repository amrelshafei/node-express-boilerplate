const redis = require("redis");

/**
 * Creates and connects the client that connects to the Redis server. The given
 * handlers are hooked to the client to handle events for when the client is
 * successfully connected and for when an error is encountered.
 * @param {(client: redis.RedisClient) => void} onConnect Callback function that
 * is handled when the client is successfully connected to the Redis server.
 * @param {(err: any) => void} onError Callback function that is handled when
 * encountering an error connecting to the Redis server or when an error in Node
 * Redis occurs.
 * @returns The client that connects to the Redis server.
 * @author Amr ElShafei
 * @since 01/12/2020
 */
function createConnection(onConnect, onError) {
  // The client options object for the Redis server.
  const host = process.env.REDIS_HOST || "127.0.0.1";
  const port = process.env.REDIS_PORT || "6379";
  const options = { host, port };
  // Creates the client that connects to the Redis server.
  const client = redis.createClient(options);
  console.log(
    "[MESSAGE LOG] created the client that connects to the Redis server"
  );
  // Adding an event handler for when the client is successfully connected to
  // the Redis server.
  client.on("connect", function () {
    console.log(
      "[MESSAGE LOG] client is successfully connected to the Redis server"
    );
    if (onConnect) onConnect(client);
  });
  // Adding an event handler for when encountering an error connecting to the
  // Redis server or when an error in Node Redis occurs.
  client.on("error", function (err) {
    console.log(
      "[MESSAGE LOG] error encountered when connecting to the Redis server or when one in Node Redis occurs:"
    );
    console.error(err);
    if (onError) onError(err);
  });
  // Return the client.
  return client;
}

/**
 * The client that connects to the Redis server.
 * @author Amr ElShafei
 * @since 01/12/2020
 */
const connection = createConnection();

module.exports = connection;
