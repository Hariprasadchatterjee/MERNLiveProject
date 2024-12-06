const {check} =require("express-validator")
exports.NameValidator= check("name")
.notEmpty()
.withMessage("First name is mandatory")
.trim()
.isLength({min: 2})
.withMessage('First Name should be minium 2 chars')
.matches(/^[a-zA-Z\s]+$/)
.withMessage('First Name should only contain english aplhabets');

exports.EmailValidator= check("email")
.trim()
.isEmail()
.withMessage('Please enter a valid email')
.normalizeEmail();

exports.passwordValidator= check("password")
.trim()
  .isLength({min: 8})
  .withMessage('Password should be minium 8 chars')
  .matches(/[a-z]/)
  .withMessage('Password should have atleast one small alphabet')
  .matches(/[A-Z]/)
  .withMessage('Password should have atleast one capital alphabet')
  .matches(/[!@#$%^&*_":?]/)
  .withMessage('Password should have atleast one Special Character');

exports.confirmPasswordValidator= check("cfpassword")
.trim()
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Confirm Password does not match Password');
    }
    return true;
  });

  exports.userTypeValidator = check('userType')
  .trim()
  .notEmpty()
  .withMessage('User type is required')
  .isIn(['guest', 'host'])
  .withMessage('User type is invalid');