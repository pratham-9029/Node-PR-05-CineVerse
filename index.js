import express from "express";
import router from "./routers/index.js";
import bodyParser from "body-parser";
import { envConfig } from "./config/dotenv.js";
import db from "./config/database.js";

const app = express();
const PORT = envConfig.PORT || 3000;
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'))

app.use(router);

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Server started on port ${PORT}`);
    console.log('http://127.0.0.1:' + PORT);
});