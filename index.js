const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ extended: true }));

app.use("/api/users", require("./router/user"));
app.use("/api/auth", require("./router/auth"));
app.use("/api/project", require("./router/project"));
app.use("/api/task", require("./router/task"));

app.listen(PORT, () => {
  console.log(`Server on PORT: ${PORT}`);
});
