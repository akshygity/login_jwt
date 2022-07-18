var express = require("express");
var router = express.Router();
let Controllers = require("../controllers");
const bcrypt = require("bcrypt");
const Admin = require("../models");
const auth_admin = require("../middleware/validateToken.js");


//protected route with the help of middleware
router.get("/",auth_admin,async (req, res, next) => {
  let data = await Controllers.adminController.getAlladmin(req,res,req.query);
  res.json(data);
  // res.render("admin/register_admin");
});

router.post("/", Controllers.adminController.upload.single("profilepic"),async (req, res, next) => {
  let data = await Controllers.adminController.addAdmin(req,req.body);
  if (data) {
    res.json({
      status: 200,
      message: " Hi Admin",
      data,
    });
  
  } else {
    res.json({ status: 400, message: "Something Wrong!!" });
  }
});
// public route
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  let Admin = await Controllers.adminController.checkAdmin(req.body);

  if (Admin === null) {
    res.send({ status: "fail", message: "Admin not found" });
  } else {
    const { id, dbemail, dbpassword, token } = Admin;
    const isMatch = await bcrypt.compare(password, Admin.password);
    if (Admin.email === email && isMatch) {
      res.send({ status: "success", message: "Login Success", token });
    } else {
      res.send({ status: "fail", message: "Login failed" });
    }
  }
});

router.get("/:id", async (req, res, next) => {
  let data = await Controllers.adminController.getAdminDetail(req.params);
  if (data) res.json({ status: 200, data: data });
  else {
    res.json({ status: 400, message: "Something Wrong!!" });
  }
});

router.use("/change-password", auth_admin);
//protected route with the help of middleware
router.post("/change-password", async (req, res, next) => {
  let data = await Controllers.adminController.changePassword(
    req,
    res,
    req.body
  );
  if (data === null) {
    res.send({ status: "fail", message: "email not found" });
  } else {
    res.send({ status: "success", message: "password changed successfully" });
  }
});
// public route
router.post("/reset-password-email", async (req, res, next) => {
  let data = await Controllers.adminController.resetPasswordmail(req.body);
  if (data ===null) {
    res.send({ status: "fail", message: "email not found" });
  } else {
    res.send({ status: "success", message: "email sent successfully" });
  }
});
// public route
router.post("/reset-password/:id/:token", async (req, res, next) => {
  let data = await Controllers.adminController.resetPassword(req);
  if (data === null) {
    res.send({ status: "fail", message: "email not found" });
  } else {
    res.send({ status: "success", message: "password changed successfully" });
  }
});

// protected route with the help of middleware
router.use("/edit", auth_admin);

router.put("/edit", async (req, res, next) => {
  let data = await Controllers.adminController.editDetails(req,res,req.body);
  if (data) res.json({ status: 200, message: "Updated  details Successfully" });
  else {
    res.json({ status: 400, message: "Something Wrong!!" });
  }
});

//protected route with the help of middleware
router.post("/logout", auth_admin, (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;

    res.clearCookie(SESSION_COOKIE);

    res.json({ message: "OK" });
  });
});

module.exports = router;
