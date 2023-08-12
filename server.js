const express = require('express');
const cors = require('cors');
const API = require('./api');
const http = require("http");
const DB_CONNECT = require('./config/dbConnect');
const cookieSession = require('cookie-session');
const { notFound, errorHandler } = require('./middlewares/errorHandling');
const { log } = require('./middlewares/log');
require('dotenv').config();
const PORT = process.env.PORT;

const app = express();
DB_CONNECT();

const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use('/uploads', express.static('uploads'));
app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY],
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
}));

app.use(cors({ origin: "*", credentials: true }));
app.get('/', (req, res) => res.json({ message: 'Welcome to the Peace-Maker' }));

app.use(log);
new API(app).registerGroups();
app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}/`);
});
