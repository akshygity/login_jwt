const Models = require("../models");
const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const Uuid =require('uuid');


// const { createTokens, validateToken } = require("../middleware/validateToken");

exports.getadmin = (criteria, projection, limit, offset) => {
  console.log(criteria);
  return new Promise((resolve, reject) => {
    Models.Admin.findAll({
      where: criteria,
      attributes: projection,
      
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

exports.addadmin = (objToSave) => {
  console.log("errrrrrrrr",objToSave)
  return new Promise((resolve, reject) => {
    const  {name,email,password,profilepic}=objToSave
    
    bcrypt.hash(password, 10).then((hash) => {
      Models.Admin.create({
          id:Uuid.v4(),
          name:name,
          email:email,
          password:hash,
          profilepic:profilepic
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  });
};

exports.getadminDetail = (criteria, projection) => {
  return new Promise((resolve, reject) => {
    Models.Admin.findOne({
      where: criteria,
      attributes: projection,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

exports.checkAdmin = (criteria) => {
  return new Promise((resolve, reject) => {
    Models.Admin.findOne({
      where: criteria,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

exports.updatePassword = (criteria,objToSave) => {
  return new Promise((resolve, reject) => {

    Models.Admin.update(objToSave,{
     where :criteria
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

exports.editDetails = (criteria, objToUpdate) => {
  return new Promise((resolve, reject) => {
    Models.Admin.update(objToUpdate, { where: criteria })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};