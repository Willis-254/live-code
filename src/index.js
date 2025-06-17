import mongoose from "mongoose";  // Correct spelling and ES module import
import app from "./app.js";
import config from "./src/config/index.js"

(async () => {
  try {
    // Connect to MongoDB using mongoose
    await mongoose.connect(config.MONGODB_URL);
    console.log("DB Connected!");

    // Handle app errors
    app.on("error", (err) => {
      console.error("ERROR", err);
      throw err;
    });

    // Start the server and listen on port 5000
    const onListening = () => {
      console.log(`Listening on port ${config.PORT}`);
    };

    app.listen(config, onListening);
  } catch (err) {
    console.error("ERROR:", err);
    throw err;
  }
})();
