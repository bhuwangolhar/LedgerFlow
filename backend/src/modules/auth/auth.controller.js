const authService = require("./auth.service");
const { sequelize } = require("../../db");
const User = require("../../models/user.model");
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

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await authService.hashPassword(password);

    const result = await sequelize.transaction(async (t) => {
      const [orgRows] = await sequelize.query(
        `INSERT INTO organizations (id, name, created_at, updated_at)
         VALUES (gen_random_uuid(), :company_name, NOW(), NOW())
         RETURNING id`,
        {
          replacements: { company_name },
          transaction: t,
        }
      );

      const orgId = orgRows[0].id;

      const [userRows] = await sequelize.query(
        `INSERT INTO users (id, organization_id, name, email, password, phone, company_name, created_at, updated_at)
         VALUES (gen_random_uuid(), :org_id, :name, :email, :password, :phone, :company_name, NOW(), NOW())
         RETURNING id, name, email, organization_id`,
        {
          replacements: {
            org_id: orgId,
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            company_name,
          },
          transaction: t,
        }
      );

      const user = userRows[0];

      await sequelize.query(
        `UPDATE organizations SET user_id = :user_id WHERE id = :org_id`,
        {
          replacements: { user_id: user.id, org_id: orgId },
          transaction: t,
        }
      );

      return { user };
    });

    const token = authService.generateToken(result.user.id);

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        organization_id: result.user.organization_id,
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