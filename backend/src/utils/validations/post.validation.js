import joi from "joi";

const validateCreatePost = (obj) => {
  const schema = joi.object({
    content: joi.string().trim().max(280).required().messages({
      "any.required": "Content is required",
      "string.empty": "Content cannot be empty",
    }),
    img: joi.string().uri().optional().messages({
      "string.uri": "Image must be a valid URI",
    }),
  });

  return schema.validate(obj);
};

export { validateCreatePost };
