import joi from "joi";

const validateRegisterUser = (obj) => {
  const schema = joi.object({
    email: joi.string().trim().email().required(),
    username: joi.string().trim().min(3).max(30).required(),
    fullname: joi.string().trim().min(3).max(50).required(),
    password: joi.string().trim().min(8).required(),
  });

  return schema.validate(obj);
};

const validateLoginUser = (obj) => {
  const schema = joi.object({
    identifier: joi.string().trim().required().messages({
      "any.required": "Username or Email is required",
      "string.empty": "Username or Email cannot be empty",
    }),
    password: joi.string().trim().min(8).required().messages({
      "any.required": "Password is required",
      "string.min": "Password must be at least 8 characters",
    }),
  });

  return schema.validate(obj);
};

const validateUpdateUser = (obj) => {
  const schema = joi.object({
    username: joi
      .string()
      .trim()
      .min(3)
      .max(30)
      .messages({
        "string.min": "Username must be at least 3 characters",
        "string.max": "Username must be at most 30 characters",
      })
      .optional()
      .allow(""),

    fullname: joi
      .string()
      .trim()
      .min(3)
      .max(50)
      .messages({
        "string.min": "Full name must be at least 3 characters",
        "string.max": "Full name must be at most 50 characters",
      })
      .optional()
      .allow(""),

    email: joi
      .string()
      .trim()
      .email({ tlds: { allow: false } })
      .messages({
        "string.email": "Email must be a valid email address",
      })
      .optional()
      .allow(""),

    currentPassword: joi
      .string()
      .trim()
      .min(8)
      .messages({
        "string.min": "Current password must be at least 8 characters",
      })
      .optional()
      .allow(""),

    newPassword: joi
      .string()
      .trim()
      .min(8)
      .messages({
        "string.min": "New password must be at least 8 characters",
      })
      .optional()
      .allow(""),

    bio: joi
      .string()
      .trim()
      .max(160)
      .messages({
        "string.max": "Bio must be at most 160 characters",
      })
      .optional()
      .allow(""),

    link: joi
      .string()
      .uri({ scheme: ["http", "https"] })
      .trim()
      .messages({
        "string.uri": "Link must be a valid URL",
      })
      .optional()
      .allow(""),
    profileImg: joi.string().uri().optional().allow(""),
    coverImg: joi.string().uri().optional().allow(""),
  });

  return schema.validate(obj, { abortEarly: false }); // هيرجع كل الأخطاء مرة واحدة
};

export { validateRegisterUser, validateLoginUser, validateUpdateUser };
