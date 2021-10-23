// imporation de passwords validator
const passwordValidator = require("password-validator");

var passwordSchema = new passwordValidator();
 
// Add properties to it
passwordSchema
.is().min(6)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase(1)                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values


module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next();
    }
    else{
        return res
        .status(400)
        .json({error : "le mots de passe n'est pas assez forts " + passwordSchema.validate('req,body,password', { list: true })})
    }
}
