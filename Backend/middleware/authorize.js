import jwt from "jsonwebtoken";
import Auth from "../models/auth.model.js";

const authenticate = async (req, res, next) => {
  try {
    // Ensure cookie-parser is set up in your app.js before routes
    const token = req.cookies?.token; // Make sure the cookie key is "token", not "jwt"
    
    if (!token) {
      console.log("Token not found");
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Ensure userId is present in token
    if (!decoded.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    }

    // Find user
    const user = await Auth.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user to req object
    req.user = user;
    next();

  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ message: `Unauthorized: ${error.message}` });
  }
};

export default authenticate;
