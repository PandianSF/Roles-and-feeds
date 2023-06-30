// const express = require("express");
// const bodyParser = require("body-parser");
// const bcrypt = require("bcrypt");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const { generateID } = require("@jetit/id");
// const { Pool, Client } = require("pg");

// const superAdmin = [];

// const app = express();
// const port = process.env.PORT || 3000;

// const pool = new Pool({
//   type: "postgres",
//   user: "pandianr",
//   host: "localhost",
//   password: "root",
//   port: 5432,
// });

// app.use(bodyParser.json());
// app.use(cors());

// app.post("/createSuperAdmin", async (req, res) => {
//   try {
//     const { role, email, password } = req.body;

//     const existingSuperAdmin = await (
//       await pool.connect()
//     ).query(`SELECT * FROM users WHERE email = '${email}'`);
//     console.log(existingSuperAdmin.rows.length, email);

//     if (existingSuperAdmin.rows.length > 0)
//       throw new Error("Super Admin Already exists");
//     if (existingSuperAdmin.rows.length < 1) {
//       const userId = generateID("HEX");
//       const userName = "req.body.userName";
//       const email = "req.body.email";
//       const password = "req.body.password";
//       const hashedPassWord = await bcrypt.hash(password, 10);
//       const sql = `INSERT INTO users (userId,name,role,email,password) VALUES ('${userId}','${userName}','${role}','${email}','${hashedPassWord}')`;
//       pool.query(sql, (err, res) => {
//         console.log(err, res);
//       });
//     } else {
//       throw new Error("SuperAdmin already exists!");
//     }
//   } catch (error) {
//     console.log(error.message);
//     throw new Error(`Error in creating superAdmin user:`, error);
//   }
// });

// app.listen(3000, async () => {
//   await pool.connect();
//   //pool.query(
//   //"CREATE TABLE users (userId INT PRIMARY KEY , role VARCHAR , name VARCHAR , email VARCHAR , password VARCHAR)",
//   //(err, res) => {
//   //console.log(err, res);
//   //}
//   //);

//   //   //   pool.query(
//   //   //     "CREATE TABLE feeds (Id INT PRIMARY KEY , name VARCHAR , url VARCHAR, description VARCHAR)",
//   //   //     (err, res) => {
//   //   //       console.log(err, res);
//   //   //     }
//   //   //   );
//   console.log("Server Started!");
// });

/* Super-admin API to create a new user
app.post("/users", authenticateUser, (req, res) => {
  if (req.user.role !== "super-admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { username, password, role, access } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) throw err;

    pool.query(
      "INSERT INTO users (username, password, role, access) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, role, JSON.stringify(access)],
      (err, results) => {
        if (err) throw err;
        res.status(201).json({ id: results.insertId, username, role, access });
      }
    );
  });
});

// Super-admin API to update user role and access
app.put('/users/:userId', authenticateUser, (req, res) => {
  if (req.user.role !== 'super-admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { role, access } = req.body;

  pool.query('UPDATE users SET role = ?, access = ? WHERE id = ?',
    [role, JSON.stringify(access), req.params.userId],
    (err) => {
      if (err) throw err;
      res.json({ message: 'User updated successfully' });
    }
  );
});

// Super-admin API to delete a user
app.delete('/users/:userId', authenticateUser, (req, res) => {
  if (req.user.role !== 'super-admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  pool.query('DELETE FROM users WHERE id = ?',
    [req.params.userId],
    (err) => {
      if (err) throw err;
      res.json({ message: 'User deleted successfully' });
    }
  );
});  **/
