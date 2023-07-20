const app = require("./app");
const axios = require("axios");
const { expect } = require("expect");
const { TokenExpiredError } = require("jsonwebtoken");
const { json } = require("body-parser");

// const corsOptions = {
//   exposedHeaders: ["Authorization"],
// };
// app.use(cors(corsOptions));

describe("Testing superAdmin creation API", () => {
  it("test our testing framework if it works", () => {
    expect(2).toBe(2);
  });
});

//Testing the superAdmin signup API EndPoints
//const supertest = require("supertest");

const email = "raj@gmail.com";
const password = "raj@123";
const active = "true";
const name = "Pandiaraj";
const role = "superAdmin";
const data = {
  email,
  password,
  name,
  active,
  role,
};
async function signupCall() {
  const response = await axios
    .post("http://localhost:3000/signUp", data)
    .then((response) => {
      console.log(response.data);
      return response.data;
    });
  return response;
}

describe("Testing superAdmin signup API for SUCCESS case", () => {
  let token;
  it("SUCCESS CASE - test the post endpoint and returns superAdmin created successfully!", async () => {
    const response = await signupCall();
    console.log(response);
    expect(response.status).toBe("SUCCESS");
    expect(response.message).toBe("superAdmin created successfully!");
  });

  //Testing the superAdmin token creation end points
  it("SUCCESS CASE - test the post endpoint and return token creation", async () => {
    const email = "raj@gmail.com";
    const password = "raj@123";
    const data = {
      email,
      password,
    };
    const response = await axios
      .post("http://localhost:3000/super-admin-login", data)
      .then((response) => {
        console.log("=====+++++>", response.data);
        token = response.data.data;
        console.log("tokn", token);
        return response.data;
      });
    console.log("res=>", response);
    expect(response.status).toBe("SUCCESS");
    expect(response.message).toBe(
      "superAdmin login and token obtained successfully!"
    );
  });

  //Testing the superAdmin token for creating userRoles
  it("SUCCESS CASE - test the post endpoint and return userRoles created succesfully!", async () => {
    let userId;
    const name = "Raj";
    const email = "rajj@gmail.com";
    const password = "rajj@123";
    const role = "admin";
    const active = "true";
    const data = {
      name,
      email,
      password,
      role,
      active,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    };
    const response = await axios
      .post("http://localhost:3000/create-roles", data, config)
      .then((response) => {
        console.log("resss", response.data);
        userId = response.data.userId;
        console.log("userID", userId);
        return response.data;
      });
    expect(response.status).toBe("SUCCESS");
    expect(response.message).toBe("user created successfully!");
  });

  //Testing the superAdmin token for deleting roles
  it("SUCCESS-CASE - test the delete endpoint and return userRoles deleted successfully!", async () => {
    const data = userId;
    console.log(data);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    };
    const response = await axios
      .post("http://localhost:3000/delete", data, config)
      .then((response) => {
        console.log("response", response.data);
        return response.data;
      });
    expect(response.status).toBe("SUCCESS"),
      expect(response.message).toBe("user removed successfully!");
  });
});
