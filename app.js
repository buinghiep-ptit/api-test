const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessions = {};

const db = {
  users: [{ id: 1, email: "nguyenvana@gmail.com", password: "123456" }],
  posts: [
    { id: 1, title: "Post 1" },
    { id: 2, title: "Post 2" },
    { id: 3, title: "Post 3" },
    { id: 4, title: "Post 4" },
  ],
};

// [GET] /
app.get("/", (req, res) => {
  res.send("Hello World");
});

// [GET] /api/posts
app.get("/api/posts", (req, res) => {
  res.json(db.posts);
});

// [POST] /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const sessionId = Math.random().toString(36).substring(7);
  sessions[sessionId] = { userId: user.id };
  res
    .setHeader(
      "Set-Cookie",
      `sessionId=${sessionId}; HttpOnly; Max-age=3600; SameSite=None; Secure`
    )
    .json(user);
});

// [GET] /api/auth/me
app.get("/api/auth/me", (req, res) => {
  const sessionId = req.cookies.sessionId;
  const session = sessions[sessionId];
  console.log(session);
  if (!session) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const user = db.users.find((user) => user.id === session.userId);
  res.json(user);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
