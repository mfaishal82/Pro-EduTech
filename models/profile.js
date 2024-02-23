'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User)
    }

    fullname(){
      return `${this.firstName} ${this.lastName}`
    }

    get formatDOB(){
      return this.dateOfBirth.toLocaleDateString('en-GB').split('/').reverse().join('-')
    }
  }
  Profile.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
      notNull: {msg: 'First Name is required'},
      notEmpty: {msg: 'First Name is required'}
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
      notNull: {msg: 'Last Name is required'},
      notEmpty: {msg: 'Last Name is required'}
      }
    },
    dateOfBirth:{
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
      notNull: {msg: 'Date of Birth is required'},
      notEmpty: {msg: 'Date of Birth is required'}
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
      notNull: {msg: 'Gender is required'},
      notEmpty: {msg: 'Gender is required'}
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};