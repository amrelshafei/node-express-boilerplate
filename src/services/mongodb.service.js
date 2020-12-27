const mongoose = require("mongoose");

/**
 * Creates and connects the connection instance that connects to the MongoDB
 * Atlas database. The given handlers are hooked to the connection instance to
 * handle events for when the connection instance is successfully connected and
 * for when an error is encountered.
 * @param {(connection: mongoose.Connection) => void} onConnect Callback
 * function that is handled when the connection instance is successfully
 * connected to the MongoDB Atlas database.
 * @param {(err: any) => void} onError Callback function that is handled when
 * encountering an error connecting to the MongoDB Atlas database or when an
 * error in Mongoose occurs.
 * @returns The connection instance that connects to the MongoDB Atlas database.
 * @author Amr ElShafei
 * @since 01/12/2020
 */
function createConnection(onConnect, onError) {
  // The connection URI string for the MongoDB Atlas database.
  const host = process.env.MONGODB_HOST || "cluster0.kl29a.mongodb.net";
  const name = process.env.MONGODB_NAME || "database0";
  const username = process.env.MONGODB_USERNAME || "default-user";
  const password = process.env.MONGODB_PASSWORD || "somepassword";
  const uri = `mongodb+srv://${username}:${password}@${host}/${name}?retryWrites=true&w=majority`;
  // Creates the connection instance that connects to the MongoDB Atlas database.
  const connection = mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(
    "[MESSAGE LOG] created the connection instance that connects to the MongoDB Atlas database"
  );
  defineModels(connection);
  // Adding an event handler for when the connection instance is successfully
  // connected to the MongoDB Atlas database.
  connection.on("connected", function () {
    console.log(
      "[MESSAGE LOG] connection instance is successfully connected to the MongoDB Atlas database"
    );
    if (onConnect) onConnect(connection);
  });
  // Adding an event handler for when encountering an error connecting to the
  // MongoDB Atlas database or or when an error in Mongoose occurs.
  connection.on("error", function (err) {
    console.log(
      "[MESSAGE LOG] error encountered when connecting to the MongoDB Atlas database or when one in Mongoose occurs:"
    );
    console.error(err);
    if (onError) onError(err);
  });
  // Return the connection instance.
  return connection;
}

/**
 * Defines the models in the given connection.
 * @param {mongoose.Connection} connection A mongoose connection.
 * @author Amr ElShafei
 * @since 01/12/2020
 */
function defineModels(connection) {
  //Defining the education model.
  connection.model(
    "education",
    new mongoose.Schema({
      icon: { type: String, required: true },
      institute: { type: String, required: true },
      degree: { type: String, required: true },
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      location: { type: String, required: true },
      description: { type: String, required: true },
    }),
    "educations"
  );
  //Defining the experience model.
  connection.model(
    "experience",
    new mongoose.Schema({
      icon: { type: String, required: true },
      organization: { type: String, required: true },
      position: { type: String, required: true },
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      about: { type: String, required: true },
      location: { type: String, required: true },
      achievements: [String],
    }),
    "experiences"
  );
  //Defining the project model.
  connection.model(
    "project",
    new mongoose.Schema({
      date: { type: Date, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      link: new mongoose.Schema(
        {
          to: { type: String, required: true },
          title: { type: String, required: true },
        },
        { _id: false }
      ),
      skills: [{ type: String, ref: "skill" }],
      media: { type: String, required: true },
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "service",
        required: true,
      },
    }),
    "projects"
  );
  //Defining the screen model.
  connection.model(
    "screen",
    new mongoose.Schema({
      _id: { type: String, required: true },
      header: String,
      description: String,
    }),
    "screens"
  );
  //Defining the service model.
  connection.model(
    "service",
    new mongoose.Schema({
      icon: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
    }),
    "services"
  );
  //Defining the skill model.
  connection.model(
    "skill",
    new mongoose.Schema({
      _id: { type: String, required: true },
      title: { type: String, required: true },
      level: { type: Number, required: true },
      skillset: { type: mongoose.Schema.Types.ObjectId, ref: "skillset" },
    }),
    "skills"
  );
  //Defining the skillset model.
  connection.model(
    "skillset",
    new mongoose.Schema({
      title: { type: String, required: true },
      skills: [{ type: String, ref: "skill" }],
      show: { type: Boolean, default: true },
    }),
    "skillsets"
  );
}

/**
 * The connection instance that connects to the MongoDB Atlas database.
 * @author Amr ElShafei
 * @since 01/12/2020
 */
const connection = createConnection();

module.exports = connection;
