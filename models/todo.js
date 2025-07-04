"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Todo.init(
    {
      text: DataTypes.STRING,
      done: DataTypes.BOOLEAN,
      completed_at: DataTypes.DATE,
      log: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Todo",
      tableName: "Task",
    }
  );
  return Todo;
};
