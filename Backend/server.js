require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/DB");

connectToDB()
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

