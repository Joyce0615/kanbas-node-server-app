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

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb+srv://joycexie0615:Xdj19960615!@kanbas.0kd43di.mongodb.net/kanbas"
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