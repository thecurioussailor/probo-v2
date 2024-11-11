import express from "express";
import cors from "cors";
import routes from "./routes/routes"
const app = express();
app.use(cors());
app.use(express.json());

app.use('/', routes);

const port = 3000;
app.listen(port, () => {
    console.log("server is running on port " + port)
});