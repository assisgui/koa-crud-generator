import {Handler, MultipartOptions, OutputValidation} from 'koa-joi-router';
import * as Joi from "joi";
import * as CoBody from "co-body";

type TMethodOptions = {
  enabled?: boolean
  overrideHandler?: Handler
  extraHandlers?: Handler[]
  pre?: Handler
  dto?: | {
    header?: Joi.SchemaLike | undefined;
    query?: Joi.SchemaLike | undefined;
    params?: Joi.SchemaLike | undefined;
    body?: Joi.SchemaLike | undefined;
    maxBody?: number | string | undefined;
    failure?: number | undefined;
    type?: 'form' | 'json' | 'multipart' | undefined;
    formOptions?: CoBody.Options | undefined;
    jsonOptions?: CoBody.Options | undefined;
    multipartOptions?: MultipartOptions | undefined;
    output?: { [status: string]: OutputValidation } | undefined;
    continueOnError?: boolean | undefined;
    validateOptions?: Joi.ValidationOptions | undefined;
  } | undefined;
}

type TPaginationOptions = {
  enabled?: boolean
  page?: number
  limit?: number
  limitMin?: number
  limitMax?: number
}

interface TGetAllOptions extends TMethodOptions {
  pagination?: TPaginationOptions
}

export type TGenerateRouter = {
  entity: Function
  basePath?: string
  methods? : {
    getAll?: TGetAllOptions
    getOne?: TMethodOptions
    post?: TMethodOptions
    put?: TMethodOptions
    delete?: TMethodOptions
  }
}

export const defaultOptions: TGenerateRouter = {
  entity: null,
  basePath: null,
  methods: {
    getAll: {
      enabled: true,
      pagination: {
        enabled: true,
        page: 1,
        limit: 10,
        limitMin: 1,
        limitMax: 100
      }
    },
    getOne: {
      enabled: true
    },
    post: {
      enabled: true
    },
    put: {
      enabled: true
    },
    delete: {
      enabled: true
    }
  }
}

export type TPaginationResult<EntityArray> = {
  total: number
  page: number
  limit: number
  data: EntityArray
}
