const authService = require("./auth.service");
const Organization = require("../../models/organization.model");

async function signup(req, res) {
  try {
    console.log("📝 Signup request received:", {
      body: { ...req.body, password: "[REDACTED]" },
    });

    const { name, email, password, confirmPassword, phone, company_name } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword || !company_name) {
      return res.status(400).json({
        message: "Missing required fields: name, email, password, confirmPassword, company_name",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // ✅ Step 1: Hash password first
    const hashedPassword = await authService.hashPassword(password);

    // ✅ Step 2: Create a TEMP org with a placeholder user_id so DB constraint is satisfied
    // We use a transaction to keep it atomic and roll back on any failure
    const { sequelize } = require("../../db");

    const result = await sequelize.transaction(async (t) => {
      // ✅ Step 3: Create org with a dummy UUID first, update after user is created
      // OR — simpler: create user first with a temp org_id, then create org
      // SIMPLEST: create org without user_id by temporarily making it nullable via raw query
      // ACTUAL FIX: create user record first using raw insert, bypassing FK temporarily

      // Create a placeholder org (user_id will be updated after user creation)
      // We pass a raw query to defer constraint check
      const [orgResult] = await sequelize.query(
        `INSERT INTO organizations (id, name, created_at, updated_at)
         VALUES (gen_random_uuid(), :name, NOW(), NOW())
         RETURNING id`,
        {
          replacements: { name: company_name },
          transaction: t,
        }
      );

      const organizationId = orgResult[0].id;
      console.log("✅ Organization created:", organizationId);

      // Check if email already taken
      const { User } = require("../user/user.model") || {};
      const UserModel = require("../../models/user.model");
      const existing = await UserModel.findOne({
        where: { email },
        transaction: t,
      });
      if (existing) throw new Error("Email already registered");

      // Create user with organization_id
      const [userResult] = await sequelize.query(
        `INSERT INTO users (id, organization_id, name, email, password, phone, company_name, created_at, updated_at)
         VALUES (gen_random_uuid(), :org_id, :name, :email, :password, :phone, :company_name, NOW(), NOW())
         RETURNING id, name, email, organization_id`,
        {
          replacements: {
            org_id: organizationId,
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            company_name,
          },
          transaction: t,
        }
      );

      const user = userResult[0];
      console.log("✅ User created:", user.id);

      // Update org with user_id now that user exists
      await sequelize.query(
        `UPDATE organizations SET user_id = :user_id WHERE id = :org_id`,
        {
          replacements: { user_id: user.id, org_id: organizationId },
          transaction: t,
        }
      );

      console.log("✅ Organization updated with user_id");
      return { user, organizationId };
    });

    const token = authService.generateToken(result.user.id);

    console.log("✅ Signup complete for:", result.user.id);

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        organization_id: result.organizationId,
      },
    });
  } catch (error) {
    console.error("❌ Signup error:", {
      message: error.message,
      name: error.name,
      code: error.code,
    });

    if (error.message === "Email already registered") {
      return res.status(400).json({ message: "Email already registered" });
    }

    return res.status(400).json({
      message: "Signup failed",
      error: error.message,
      code: error.code || "UNKNOWN_ERROR",
    });
  }
}

async function signin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await authService.signin(email, password);
    return res.json(result);
  } catch (error) {
    return res.status(401).json({
      message: "Sign in failed",
      error: error.message,
    });
  }
}

async function verifyToken(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = authService.verifyToken(token);
    return res.json({ valid: true, userId: decoded.userId });
  } catch (error) {
    return res.status(401).json({ message: "Token verification failed", error: error.message });
  }
}

module.exports = { signup, signin, verifyToken };