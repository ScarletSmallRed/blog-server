const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const session = require("express-session")
const { CONFIG } = require("./config/keys")
const MongoStore = require("connect-mongo")(session)

require("./config/db-setup")

const blogRoutes = require("./routes/blogs")
const userRoutes = require("./routes/users")

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
  secret: CONFIG.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000
  },
  store: new MongoStore({
    url: CONFIG.mongoDB.dbURI,
    collection: "sessions"
  })
}))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", true)
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use("/blogs", blogRoutes)
app.use("/users", userRoutes)

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(process.env.port || 4000, function () {
  console.log('now listening for requests');
});
