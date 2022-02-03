import { ObjectLiteral, ILike, getConnection } from 'typeorm'

export default function generateFilterILike(
  filter: ObjectLiteral,
): ObjectLiteral {
  const { type } = getConnection().options
  const result: ObjectLiteral = {}

  Object.keys(filter).forEach(key => {
    result[key] = type === 'mongodb'
      ? new RegExp(`${filter[key]}`, 'i')
      : ILike(`%${filter[key]}%`)
  })

  return result
}
