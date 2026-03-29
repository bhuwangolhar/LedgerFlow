const { DataTypes } = require("sequelize");
const { sequelize } = require("./../db");

const Account = sequelize.define(
  "Account",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("asset", "liability", "income", "expense", "equity"),
      allowNull: false,
    },
  },
  {
    tableName: "accounts",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Account;