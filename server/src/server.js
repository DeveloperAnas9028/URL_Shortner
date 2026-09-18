import app from "./app/app.js";
import { connectDB } from "./config/db.js";
// import generateCode from "./utils/generateCode.js";

await connectDB();


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});





