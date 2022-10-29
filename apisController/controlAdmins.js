const path = require("path");
const Complaint = require(path.join(__dirname, "../models/complaintSchema"));
const User = require(path.join(__dirname, "../models/userSchema"));
const Handlebars = require("hbs");
const jwt = require("jsonwebtoken");
const Admin = require(path.join(__dirname, "../models/adminSchema"));

// get admin details
exports.getAdminDetails = async function (req, res) {
  try {
    console.log(req.params.id)
    const admin = await Admin.find({_id:req.params.id});
    if (!admin) {
      return res.status(404).json({ success: false });
    }else{
        return res.status(200).json({success: true, admin: admin });
    }
  } catch (error) {
    res.send({
        success: false,
      });
  }
};

// delete admins
exports.deleteAdmin = async (req, res, next) => {
  try {
    await Admin.findByIdAndDelete(req.body.query.AdminId);
    res.send({
      success: true,
    });
  } catch (error) {
    res.send({
      success: false,
    });
  }
};
