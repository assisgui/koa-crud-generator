import { DeleteResult, getConnection, Repository, UpdateResult } from "typeorm";
import { EntityTarget } from "typeorm/common/EntityTarget";
import {TFilters, TPaginationResult} from "./types";
import {FindOneOptions} from "typeorm/find-options/FindOneOptions";
import generateFilterILike from "./utils/generateFilterILike";

export class HandlersFactory<Entity> {
  private _repository: Repository<Entity>;

  constructor(public entity: EntityTarget<Entity>) {
    this._repository = getConnection().getRepository(entity);
  }

  // get all with filers and pagination
  public async getAll({
    page,
    limit,
    hasPagination,
    relations
  } : {
    page: number,
    limit: number,
    hasPagination?: boolean
    relations?: string[]
  }): Promise<TPaginationResult<Entity[]> | Entity[]> {
    const [ data, count ] = await this._repository.findAndCount(
      Object.assign(
        {},
        hasPagination && {
          skip: (page - 1) * limit,
          take: limit,
        },
        relations && { relations }
      )
    );

    return hasPagination ? {
      total: count,
      page,
      limit,
      data,
    } : data;
  }

  // get one by id
  public async getOne({ id, relations } : { id: number, relations?: string[] }): Promise<Entity> {
    return await this._repository.findOne(
      id,
      Object.assign({}, relations && { relations })
    );
  }

  // create new
  public async create({ data } : { data: Entity }): Promise<Entity> {
    return await this._repository.save(data);
  }

  // update by id
  public async update({ id, data } : { id: number, data: Entity }): Promise<UpdateResult> {
    return await this._repository.update(id, data);
  }

  // delete by id
  public async delete({ id } : { id: number }): Promise<DeleteResult> {
    return await this._repository.delete(id);
  }

  // find with filter and pagination
  public async search({
    filters,
    page,
    limit,
    hasPagination,
    relations
  } : {
    filters: any
    page: number
    limit: number
    hasPagination?: boolean
    relations?: string[]
  }): Promise<TPaginationResult<Entity[]> | Entity[]> {
    const [data, count] = await this._repository.findAndCount(
      Object.assign(
        {},
        { where: generateFilterILike(filters) },
        hasPagination && {
          skip: (page - 1) * limit,
          take: limit,
        },
        relations && { relations }
      )
    );

    return hasPagination
      ? {
        total: count,
        page,
        limit,
        data,
      } : data;
  }
}
