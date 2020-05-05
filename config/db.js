const mongoose = require("mongoose");
require("dotenv").config();

const configMongo = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

mongoose.connect(process.env.DB_MONGO, configMongo, () => {
  console.log("DB connected");
});
