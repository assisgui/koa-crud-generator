type TMethodOptions = {
  enabled?: boolean
  overrideHandler?: Function
  extraHandlers?: Function[]
}

type TPaginationOptions = {
  enabled?: boolean
  page?: number
  limit?: number
}

interface TGetAllOptions extends TMethodOptions {
  pagination?: TPaginationOptions
}

interface TGetOneOptions extends TMethodOptions {}

export type TGenerateRouter = {
  entity: Function
  basePath?: string
  methods? : {
    getAll?: TGetAllOptions
    getOne?: TGetOneOptions
    post?: TMethodOptions
    put?: TMethodOptions
    delete?: TMethodOptions
  }
}

export const defaultOptions: TGenerateRouter = {
  entity: null,
  basePath: '',
  methods: {
    getAll: {
      enabled: true,
      pagination: {
        enabled: true,
        page: 1,
        limit: 10
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
