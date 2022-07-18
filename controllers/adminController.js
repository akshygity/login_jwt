const Admin = require("../models/admin");
const Services = require("../services");
const Helper = require("../Helper/common");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const req = require("express/lib/request");
const { object } = require("joi");
const services = require("../services");
const emailsender = require("../mail");
const multer = require("multer");

const path =require('path');


require("dotenv").config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give a proper file format to upload.");
  },
});

module.exports = {
  getAlladmin: async (req,res,data) => {
    const { adminID, iat, exp } = req.user;
    let criteria = { id: adminID };
   
    let projection = ["name","email","profilepic"];
    let Admin = await Services.adminService.getadmin(
      criteria,
      projection,
      data.limit || 10,
      data.skip || 0
    );
    return Admin;
  },
  addAdmin: async (req,data) => {
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
        // profilepic: Joi.string().required(),
      });
      console.log("dta", data);
      let payload = await Helper.verifyjoiSchema(data, schema);
      const {name, email,password}= data
    
      const datas ={name:name,
        email:email,
        password:password,
        profilepic:req.file.path
        
      }
      if (!datas) {
        console.log("invalid data");
      } else {
        let admin = await Services.adminService.addadmin(datas);

        const token = jwt.sign(
          { adminID: admin.id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "2d" }
        );
        Object.assign(admin, { token: token });

        return admin;
      }
    } catch (error) {
      console.log(error);
    }
  },
  checkAdmin: async (data) => {
    const { email, password } = data;
    let criteria = { email: email };
    let projection = ["email", "password"];

    let Admin = await Services.adminService.checkAdmin(criteria, projection);
    if (Admin === null) {
      return Admin;
    } else {
      const token = jwt.sign(
        { adminID: Admin.id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "2d",
        }
      );
      Object.assign(Admin, { token: token });

      return Admin;
    }
  },

  getAdminDetail: async (data) => {
    let criteria = {};
    let projection = ["email", "password"];
    let admin = await Services.adminService.getadmin(criteria, projection);
    return admin;
  },

  changePassword: async (req, res, data) => {
    const { old_password, new_password } = data;
    console.log('cccccp',data)
    const { adminID, iat, exp } = req.user;
    let criteria = { id: adminID };
    console.log("criteria",criteria)

    let admin = await services.adminService.checkAdmin(criteria);
    const {id,name, email,password,profilepic}=admin
    console.log("seee",password)

    const isMatch = await bcrypt.compare(old_password,password);
        // const isMatch= bcrypt.compareSync(password,old_password); 
        console.log("check",isMatch)

    if (isMatch) {
      const salt = await bcrypt.genSalt(10);
      console.log("salt",salt)
      const newHashPassword = await bcrypt.hash(new_password, salt);
    
      console.log("new",newHashPassword)
       
      const objtosave = {
        password: newHashPassword,
      };
      let admin = await Services.adminService.updatePassword(
        criteria,
        objtosave
      );
      console.log("sss",criteria)
      return admin;
    } else {
      return null;
    }
  },

  resetPasswordmail: async (data) => {
    // const { admin_email } = data;
    let criteria = { email: data.email };

    let admin = await services.adminService.checkAdmin(criteria);

    const { id, name, email, password, profilepic } = admin;

    console.log("id ", id);
    if (admin) {
      const secret = id + process.env.JWT_SECRET_KEY;

      const token = jwt.sign({ adminID: id }, secret, { expiresIn: "2d" });
      const link = `http://localhost:8000/admin/reset/${id}/${token}`;

      console.log(link);

      await emailsender(email, link);
      return admin

    } else {
      return null;
    }
  },

  resetPassword: async (req, res) => {
    const { new_password, password_confirmation } = req.body;
    const { id, token } = req.params;
    let criteria1 = { id: id };
    const admin = await services.adminService.checkAdmin(criteria1);

    try {
      const { id, name, email, password, profilepic } = admin;

      const new_secret = id + process.env.JWT_SECRET_KEY;
      jwt.verify(token, new_secret);
      console.log("my-password", password_confirmation, new_password);
      if (new_password && password_confirmation) {
        if (new_password !== password_confirmation) {
          return null;
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(new_password, salt);
          const objtosave = {
            password: newHashPassword,
          };

          let criteria = { email: email };

          let admin = await Services.adminService.updatePassword(
            criteria,
            objtosave
          );

          return admin;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  },

  editDetails: async (req,res,data) => {
    let dataToUpdate = {};
    
    const { adminID, iat, exp } = req.user;
    if (data && data.name) dataToUpdate.name = data.name;
    if (data && data.profilepic) dataToUpdate.profilepic = data.profilepic;
   
    let criteria = {
      id: adminID,
    };
    let saveEditDeatils = await Services.adminService.editDetails(
      criteria,
      dataToUpdate
    );
    console.log(saveEditDeatils);
    return saveEditDeatils;
  },

  upload
};

  