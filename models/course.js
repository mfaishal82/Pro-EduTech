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

    static greetUser() {
      return 'Welcome! Choose a course that interests you';
    }

  }
  Course.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
      notNull: {msg: 'name is required'},
      notEmpty: {msg: 'name is required'}
      }
    },
    description:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
      notNull: {msg: 'description is required'},
      notEmpty: {msg: 'description is required'}
      }
    },
    availability: DataTypes.BOOLEAN,
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Categories"
      },
      validate: {
        notNull: {msg: 'Category is required'},
      notEmpty: {msg: 'Category is required'}
      }
    },
    rating: DataTypes.INTEGER,
    imageURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
      notNull: {msg: 'Image Url is required'},
      notEmpty: {msg: 'Image Url is required'}
      }
    },
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