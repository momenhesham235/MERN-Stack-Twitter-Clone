import joi from "joi";


const validateRegisterUser = (obj) => {
  const schema = joi.object({
    username: joi.string().trim().min(3).max(30).required(),
    fullname: joi.string().trim().min(3).max(50).required(),
    email: joi.string().trim().email().required(),
    password: joi.string().trim().min(8).required(),
  });

  return schema.validate(obj);
};

const validateLoginUser = (obj) => {
  const schema = joi.object({
    identifier: joi.string()  
      .trim()
      .required()
      .messages({
        "any.required": "Username or Email is required",
        "string.empty": "Username or Email cannot be empty",
      }),
    password: joi.string()
      .trim()
      .min(8)
      .required()
      .messages({
        "any.required": "Password is required",
        "string.min": "Password must be at least 8 characters",
      }),
  });

  return schema.validate(obj); // return all errors
};


// validate Update User
const validateUpdateUser = (obj) => {
  const schema = joi.object({
    username: joi.string().trim().min(3).max(30),
    fullName: joi.string().trim().min(3).max(50),
    email: joi.string().trim().email().required(),
    currentPassword: joi.string().trim().min(8).messages({
      "string.min": "Current password must be at least 8 characters",
    }),
    newPassword: joi.string().trim().min(8).messages({ 
       "string.min": "New password must be at least 8 characters" 
      }),
    bio: joi.string().trim().max(160).allow(''),
    link: joi.string().uri().trim().allow(''),
  });

  return schema.validate(obj);
};

export { validateRegisterUser, validateLoginUser, validateUpdateUser };
