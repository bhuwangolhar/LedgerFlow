const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL: JWT_SECRET not set in environment variables");
  process.exit(1);
}
const JWT_EXPIRY = "24h";

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

async function createUserWithOrg(data) {
  // Check if user already exists
  const existingUser = await User.findOne({ where: { email: data.email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user with organization_id
  const user = await User.create({
    organization_id: data.organization_id,
    name: data.name,
    email: data.email,
    password: hashedPassword,
    phone: data.phone,
    company_name: data.company_name
  });

  return user;
}

async function signup(data) {
  // Check if user already exists
  const existingUser = await User.findOne({ where: { email: data.email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user
  const user = await User.create({
    organization_id: data.organization_id,
    name: data.name,
    email: data.email,
    password: hashedPassword,
    phone: data.phone,
    company_name: data.company_name
  });

  // Generate token
  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      organization_id: user.organization_id,
      phone: user.phone,
      company_name: user.company_name
    }
  };
}

async function signin(email, password) {
  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      organization_id: user.organization_id,
      phone: user.phone,
      company_name: user.company_name
    }
  };
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

module.exports = {
  signup,
  signin,
  verifyToken,
  generateToken,
  hashPassword,
  comparePassword,
  createUserWithOrg
};
