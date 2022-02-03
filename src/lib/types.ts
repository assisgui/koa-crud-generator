import { Handler, MultipartOptions, OutputValidation } from 'koa-joi-router'
import * as Joi from "joi"
import { Joi as joiRouter } from "koa-joi-router";
import * as CoBody from "co-body"

export type TDto = {
  header?: Joi.SchemaLike | undefined
  query?: Joi.SchemaLike | undefined
  params?: Joi.SchemaLike | undefined
  body?: Joi.SchemaLike | undefined
  maxBody?: number | string | undefined
  failure?: number | undefined
  type?: 'form' | 'json' | 'multipart' | undefined
  formOptions?: CoBody.Options | undefined
  jsonOptions?: CoBody.Options | undefined
  multipartOptions?: MultipartOptions | undefined
  output?: { [status: string]: OutputValidation } | undefined
  continueOnError?: boolean | undefined
  validateOptions?: Joi.ValidationOptions | undefined
}

export interface TFilters {
  type: 'number' | 'string' | 'boolean' | 'date'
  field: string
}

type TEndpointOptions = {
  enabled?: boolean
  overrideHandler?: Handler
  extraHandlers?: Handler[]
  pre?: Handler
  dto?: TDto | undefined
}

type TPaginationOptions = {
  enabled?: boolean
  page?: number
  limit?: number
  limitMin?: number
  limitMax?: number
}

interface TGetAllOptions extends TEndpointOptions {
  pagination?: TPaginationOptions,
  relations?: string[] | undefined
}

interface TSearchOptions extends Pick<TEndpointOptions, 'enabled' | 'overrideHandler' | 'extraHandlers' | 'pre'> {
  pagination?: TPaginationOptions,
  filters?: TFilters[]
  relations?: string[] | undefined
  dto?: any
}

interface TGetOneOptions extends TEndpointOptions {
  relations?: string[] | undefined
}

export type TGenerateRouter = {
  entity: Function
  basePath?: string
  endpoints? : {
    getAll?: TGetAllOptions
    search?: TSearchOptions
    getOne?: TGetOneOptions
    post?: TEndpointOptions
    put?: TEndpointOptions
    delete?: TEndpointOptions
  }
}

export const defaultOptions: TGenerateRouter = {
  entity: null,
  basePath: null,
  endpoints: {
    getAll: {
      enabled: true,
      pagination: {
        enabled: true,
        page: 1,
        limit: 10,
        limitMin: 1,
        limitMax: 100
      },
      relations: []
    },
    search: {
      enabled: true,
      pagination: {
        enabled: true,
        page: 1,
        limit: 10,
        limitMin: 1,
        limitMax: 100
      },
      relations: [],
      dto: {
        type: 'json',
        body: joiRouter.any()
      }
    },
    getOne: {
      enabled: true,
      relations: []
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
