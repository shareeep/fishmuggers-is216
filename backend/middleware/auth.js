const { auth } = require("../services/firebase");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader); // Logging

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("Unauthorized: No token provided.");
    return res
      .status(401)
      .json({ message: "Unauthorized. No token provided." });
  }

  const idToken = authHeader.split(" ")[1];
  console.log("ID Token:", idToken); // Logging

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    // console.log("Decoded Token:", decodedToken); // Logging
    req.user = decodedToken; // Attach user info to request
    next();
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

module.exports = authenticate;