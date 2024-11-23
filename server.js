const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const noteRoutes = require("./routes/notes");
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/notes", noteRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
