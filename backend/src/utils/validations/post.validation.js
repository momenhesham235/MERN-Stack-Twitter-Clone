import joi from "joi";

const validateCreatePost = (obj) => {
  const schema = joi.object({
    content: joi
      .string()
      .trim()
      .max(280)
      .required()
      .messages({
        "any.required": "Content is required",
        "string.empty": "Content cannot be empty",
      })
      .required(),
    img: joi.string().uri().allow("").optional(),
  });

  return schema.validate(obj);
};

export { validateCreatePost };
