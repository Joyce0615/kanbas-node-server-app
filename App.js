import "dotenv/config";
import session from "express-session";
import express from 'express';
import mongoose from "mongoose";
import UserRoutes from "./Users/routes.js";
import Hello from './Hello.js';
import Lab5 from './Lab5/index.js';
import CourseRoutes from './Kanbas/Courses/routes.js';
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import AssignmentRoutes from './Kanbas/Assignments/routes.js';
import cors from "cors"

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kanbas"
console.log(process.env.MONGO_CONNECTION_STRING);
console.log(CONNECTION_STRING);
mongoose.connect(CONNECTION_STRING);
const app = express()
app.use(cors({
  credentials: true,
  origin: process.env.NETLIFY_URL || "http://localhost:3000",
}));
app.use(express.json()); // Do all work after this line
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kanbas",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}
app.use(session(sessionOptions)
);

UserRoutes(app);
Hello(app)
CourseRoutes(app)
ModuleRoutes(app)
AssignmentRoutes(app)
Lab5(app)
app.listen(process.env.PORT || 4000)

// app.use((req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "*",
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE",
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers",
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.setHeader("Access-Control-Allow-Private-Network", true);
//   //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
//   res.setHeader("Access-Control-Max-Age", 7200);

//   next();
// });