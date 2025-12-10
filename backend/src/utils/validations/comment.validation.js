import joi from "joi";

// Validate Create Comment
function validateCreateComment(obj) {
  const schema = joi.object({
    postid: joi.string().required().label("Post ID"),
    content: joi.string().trim().required().label("Text"),
  });
  return schema.validate(obj);
}

// Validate Update Comment
function validateUpdateComment(obj) {
  const schema = joi.object({
    content: joi.string().trim().required(),
  });
  return schema.validate(obj);
}

export { validateCreateComment, validateUpdateComment };
