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
    password: joi.string().trim().min(8),
    bio: joi.string().trim().max(200),
  });

  return schema.validate(obj);
};

export { validateRegisterUser, validateLoginUser, validateUpdateUser };
