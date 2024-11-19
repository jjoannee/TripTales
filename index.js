import { createApp } from "./config.js";

const app = createApp({
  user: "cold_wildflower_553",
  host: "bbz.cloud",
  database: "cold_wildflower_553",
  password: "e43a7bc0df943746649cb95568bab042",
  port: 30211,
});

/* New Post */
app.get("/new_post", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  res.render("new_post", {});
});

/* Start */
app.get("/", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  const posts = await app.locals.pool.query(
    "SELECT posts.*, users.username FROM posts INNER JOIN users ON posts.user_id = users.id;"
  );
  const images = await app.locals.pool.query("SELECT * FROM images");
  res.render("start", {
    posts: posts.rows,
    images: images.rows,
  });
});

/* login */
app.get("/login", async function (req, res) {
  const posts = await app.locals.pool.query(
    "SELECT posts.*, users.username FROM posts INNER JOIN users ON posts.user_id = users.id;"
  );
  const images = await app.locals.pool.query("SELECT * FROM images");
  res.render("login", {
    posts: posts.rows,
    images: images.rows,
  });
});

/* new_post */
app.get("/new_post", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  res.render("new_post", {});
});

app.post("/create_post", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  await app.locals.pool.query(
    "INSERT INTO posts (title, contents, country, created_at) VALUES ($1, $2, $3, current_timestamp)",
    [req.body.title, req.body.contents, req.body.country]
  );
  res.redirect("/");
});

/* Blog */
app.get("/blog/:id", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  const posts = await app.locals.pool.query(
    `SELECT posts.*, users.username FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.id = ${req.params.id};`
  );
  const images = await app.locals.pool.query("SELECT * FROM images");
  res.render("blog", {
    posts: posts.rows,
    images: images.rows,
  });
});

/* Favourites */
app.get("/favourites", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  const favourites = await app.locals.pool.query("SELECT * FROM favourites");
  const images = await app.locals.pool.query("SELECT * FROM images");
  res.render("favourites", {
    favourites: favourites.rows,
    images: images.rows,
  });
});

/* Account */
app.get("/account", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  const users = await app.locals.pool.query("SELECT * FROM account");
  res.render("account", { users: users.rows });
});

/* Impressum */
app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get("*", (req, res) => {
  res.render("404", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
