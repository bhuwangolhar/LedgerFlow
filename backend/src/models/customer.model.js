const { DataTypes } = require("sequelize");
const { sequelize } = require("./../db");

const Customer = sequelize.define(
  "Customer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    organization_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    customer_no: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    city: {
      type: DataTypes.STRING,
      allowNull: true
    },

    state: {
      type: DataTypes.STRING,
      allowNull: true
    },

    postal_code: {
      type: DataTypes.STRING,
      allowNull: true
    },

    country: {
      type: DataTypes.STRING,
      allowNull: true
    },

    tax_id: {
      type: DataTypes.STRING,
      allowNull: true
    },

    payment_terms: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "customers",
    timestamps: true,
    underscored: true
  }
);

module.exports = Customer;
