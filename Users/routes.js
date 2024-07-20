import * as dao from "./dao.js"; 

export default function UserRoutes(app) {
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  }; 
  app.post("/api/users", createUser); 
  
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };
  app.delete("/api/users/:userId", deleteUser); 

  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
  };
  app.get("/api/users", findAllUsers);

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };
  app.get("/api/users/:userId", findUserById);

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const status = await dao.updateUser(userId, req.body);
    res.json(status);
  };
  app.put("/api/users/:userId", updateUser); 

  const signup = async (req, res) => { 
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json(
        { message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  app.post("/api/users/signup", signup); 

  const signin = async (req, res) => { 
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
      } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };
  app.post("/api/users/signin", signin); 

  const signout = (req, res) => { 
    req.session.destroy();
    res.sendStatus(200);
  };
  app.post("/api/users/signout", signout); 

  const profile = async (req, res) => { 
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  }; 
  app.post("/api/users/profile", profile);
}