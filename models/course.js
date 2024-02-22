'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.Category)
      Course.belongsToMany(models.User, {
        through: models.UserCourse
      })
    }
  }
  Course.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    availability: DataTypes.BOOLEAN,
    CategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Categories"
      }
    },
    rating: DataTypes.INTEGER,
    imageURL: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Course',
    hooks: {
      beforeCreate: (instance, options) => {
        instance.rating = 1
        instance.availability = true
      }
    }
  });
  return Course;
};