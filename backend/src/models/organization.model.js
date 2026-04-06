const { DataTypes } = require("sequelize");
const { sequelize } = require("./../db");

const Organization = sequelize.define(
  "Organization",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: true  // Allow null during signup, will be set after user creation
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "organizations",
    timestamps: true,
    underscored: true
  }
);

module.exports = Organization;