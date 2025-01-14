import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

//Connection and listeners
const PORT = process.env.PORT || 4000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => console.log("Server is running on port 4000"));
  })
  .catch((error) => console.log(error));
