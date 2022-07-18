var sequelize = require("../dbConnection").sequelize;
var Sequelize = require("sequelize");

let Admin = sequelize.define(
  "admin",
  {
    id: {
      defaultValue: Sequelize.DataTypes.UUIDV4,
      type: Sequelize.UUID,
      primaryKey: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: null,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      unique:true
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: null,
    },
    profilepic: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: null
    },
  },
  {
    tableName: "admin",
    timestamps: true,
  }
);

module.exports = Admin;
