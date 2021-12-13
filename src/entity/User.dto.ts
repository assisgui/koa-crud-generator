import { Joi } from "koa-joi-router";
import { TDto } from "../lib/types";

export default {
  post: {
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      age: Joi.number().integer().required()
    }),
    type: 'json'
  } as TDto,
  put: {
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      age: Joi.number().integer().required()
    }),
    type: 'json'
  } as TDto
}
