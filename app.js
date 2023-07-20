const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool, Client } = require("pg");
const cors = require("cors");
const { generateID } = require("@jetit/id");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  type: "postgres",
  user: "pandianr",
  host: "localhost",
  password: "root",
  port: 5432,
});

//Middle-ware for authentication
function authenticateUser(req, res, next) {
  const superAdminToken = req.headers.authorization;
  const secret = "your-secret-key";
  try {
    if (!superAdminToken) {
      res.send({
        status: "ERROR",
        message: "No token found!",
      });
    }
    jwt.verify(superAdminToken, secret, (err, authDecoded) => {
      if (err) {
        res.send({
          status: "ERROR",
          message: "Access denied to this token/Invalid token!",
        });
      }
      req.email = authDecoded.email;
      req.role = authDecoded.role;
      next();
    });
  } catch (err) {
    res.send({
      status: "ERROR",
      message: err.message,
    });
  }
}

/** Middleware for authorisation
function authorisedUser(req, res, next) {
  const userRole = req.role;
  console.log("role===>", userRole);
  if (userRole !== "superAdmin") {
    res.send({
      status: "ERROR",
      message: "Insufficient permissions!",
    });
  } else {
    res.send({
      status: "SUCCESS",
      message: "Access granted for this user!",
    });
  }
  next();
} **/

//Creating Super-admin
app.post("/signUp", async (req, res) => {
  try {
    const { email, password } = req.body;
    const superAdminExists = await (
      await pool.connect()
    ).query(`SELECT * FROM users WHERE email = '${email}'`);
    console.log("====>", superAdminExists.rows, email);

    if (superAdminExists.rows.length > 0) {
      throw new Error("superAdmin already exists!");
    }
    if (superAdminExists.rows.length < 1) {
      const name = req.body.name;
      const role = req.body.role;
      const saltRounds = 10;
      const passWord = await bcrypt.hash(password, saltRounds);
      const userId = generateID("HEX");
      const active = req.body.active;
      const superAdmin = { name, userId, email };

      const sql = `INSERT INTO users (name,userid,email,password,role,active) VALUES ('${name}','${userId}','${email}','${passWord}','${role}','${active}')`;
      pool.query(sql, (err, res) => {
        console.log(err, res);
      });

      res.send({
        status: "SUCCESS",
        data: superAdmin,
        message: "superAdmin created successfully!",
      });
    }
  } catch (err) {
    res.send({
      status: "ERROR",
      message: err.message,
    });
  }
});

app.post("/super-admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const superAdminExists = await (
      await pool.connect()
    ).query(`SELECT * FROM users WHERE email = '${email}'`);

    if (superAdminExists.rows.length > 0) {
      let superAdmin = superAdminExists.rows[0];
      let hashedPassWord = superAdmin.password;
      const matching = await bcrypt.compare(password, hashedPassWord);

      if (matching === true) {
        const payload = {
          email: email,
          userId: superAdmin.userid,
          role: superAdmin.role,
        };
        const secret = "your-secret-key";
        const options = { expiresIn: "1h" };
        const superAdminToken = jwt.sign(payload, secret, options);
        res.send({
          status: "SUCCESS",
          data: superAdminToken,
          message: "superAdmin login and token obtained successfully!",
        });
      } else {
        throw new Error("Incorrect PassWord!");
      }
    } else {
      throw new Error("user does not exists!");
    }
  } catch (err) {
    res.send({
      status: "ERROR",
      message: err.message,
    });
  }
});

app.post("/admin-token", authenticateUser, async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminId = generateID("HEX");
    const payload = {
      email: email,
      adminId: adminId,
    };
    const secret = "secret-key";
    const options = { expiresIn: "1h" };
    const adminToken = jwt.sign(payload, secret, options);
    res.send({
      status: "SUCCESS",
      data: adminToken,
      message: "admin token generated successfully!",
    });
  } catch (err) {
    res.send({
      status: "ERROR",
      message: err.message,
    });
  }
});

//To create roles using superadmin token
app.post("/create-roles", authenticateUser, async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRole = req.role;
    if (userRole !== "superAdmin") {
      res.send({
        status: "ERROR",
        message: "not an authorised user!",
      });
    }
    const name = req.body.name;
    const role = req.body.role;
    const saltRounds = 10;
    const passWord = await bcrypt.hash(password, saltRounds);
    const active = req.body.active;
    const userId = generateID("HEX");
    const user = { name, email, passWord, userId };

    const sql = `INSERT INTO users (userid,role,name,email,password,active) VALUES ('${userId}','${role}','${name}','${email}','${passWord}','${active}')`;

    pool.query(sql, (err, res) => {});
    res.send({
      status: "SUCCESS",
      data: user,
      message: "user created successfully!",
    });
  } catch (err) {
    res.send({
      status: "ERROR",
      message: err.message,
    });
  }
});

// Delete roles using superAdmin token
app.delete("/delete", authenticateUser, async (req, res) => {
  const userRole = req.role;
  const email = req.email;
  if (userRole !== "superAdmin") {
    res.send({
      status: "ERROR",
      message: "Not an authorised user!",
    });
  }
  const superAdminExists = await (
    await pool.connect()
  ).query(`SELECT * FROM users WHERE email = '${email}'`);
  console.log("email====>", email);
  if (superAdminExists.rows.length > 0) {
    const userId = req.body.userId;
    const sql = `UPDATE users SET active = false WHERE userId = '${userId}'`;
    console.log("sel====>", sql);
    try {
      (await pool.connect()).query(sql);
      res.send({
        status: "SUCCESS",
        message: "user removed succesfully!",
      });
    } catch (err) {
      res.send({
        status: "ERROR",
        message: err.message,
      });
    }
  } else {
    res.send({
      status: "ERROR",
      message: "user does not exists!",
    });
  }
});
app.listen(3000, async () => {
  await pool.connect();
  console.log("db connected!");
  // pool.query(
  //   "CREATE TABLE users (userid VARCHAR PRIMARY KEY, role VARCHAR , name VARCHAR , email VARCHAR , password VARCHAR, active BOOLEAN)",
  //   (err, res) => {
  //     console.log(err, res);
  //   }
  // );

  // pool.query(
  //   "CREATE TABLE feeds (id VARCHAR , name VARCHAR , url VARCHAR , description VARCHAR)",
  //   (err, res) => {
  //     console.log(err, res);
  //   }
  // );
  console.log("Server started!");
});
