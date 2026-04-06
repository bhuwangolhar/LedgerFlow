const authService = require("./auth.service");
const Organization = require("../../models/organization.model");

async function signup(req, res) {
  try {
    console.log("📝 Signup request received:", {
      body: req.body,
      headers: { "content-type": req.headers["content-type"] }
    });

    const { name, email, password, confirmPassword, phone, company_name } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword || !company_name) {
      console.warn("❌ Validation failed: Missing required fields");
      return res.status(400).json({
        message: "Missing required fields: name, email, password, confirmPassword, company_name",
        received: { name, email, password, confirmPassword, company_name }
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      console.warn("❌ Validation failed: Passwords do not match");
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    console.log("✅ Validation passed, creating organization...");

    // Create organization first (with user_id as null)
    const organization = await Organization.create({
      name: company_name,
      user_id: null  // Will be set after user creation
    });

    console.log("✅ Organization created:", organization.id);
    console.log("✅ Creating user...");

    // Create user with the organization_id
    const user = await authService.createUserWithOrg({
      name,
      email,
      password,
      phone,
      company_name,
      organization_id: organization.id
    });

    console.log("✅ User created:", user.id);

    // Update organization with the user_id
    await organization.update({ user_id: user.id });

    // Generate token
    const token = authService.generateToken(user.id);

    console.log("✅ Signup successful for user:", user.id);

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organization_id: organization.id
      }
    });
  } catch (error) {
    console.error("❌ Signup error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    // Send detailed error to client
    res.status(400).json({
      message: "Signup failed",
      error: error.message,
      type: error.name,
      code: error.code || "UNKNOWN_ERROR",
      detail: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
}

async function signin(req, res) {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Call auth service
    const result = await authService.signin(email, password);

    res.json(result);
  } catch (error) {
    res.status(401).json({
      message: "Sign in failed",
      error: error.message
    });
  }
}

async function verifyToken(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = authService.verifyToken(token);
    res.json({ valid: true, userId: decoded.userId });
  } catch (error) {
    res.status(401).json({
      message: "Token verification failed",
      error: error.message
    });
  }
}

module.exports = {
  signup,
  signin,
  verifyToken
};
