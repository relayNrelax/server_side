import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const VerifyToken = async (req, res, next) => {
  try {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
      jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err && err.name === "TokenExpiredError") {
          res.status(401).send({ status: "fail", message: "Token has expired" });
        } else if (err) {
          res.status(400).send({ status: "fail", message: "Token is not valid" });
        } else {
          req.user = await UserModel.findById(decoded.userId);
          next();
        }
      });
    } else {
      res.status(400).send({ status: "fail", message: "Token is not provided" });
    }
  } catch (error) {
    res.status(400).send({ status: "fail", message: error.message });
  }
};

export default VerifyToken;
