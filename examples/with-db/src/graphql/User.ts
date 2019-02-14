import { prismaObjectType } from 'yoga'

/**
 * Expose the `User` type with all the fields of the underlying object type
 * export const User = prismaObjectType({
 *   name: 'User',
 *   definition(t) {
 *     // If you wish you customize/hide fields, call `t.prismaFields(['id', ...])`  with the desired field names
 *     // If you wish to add custom fields on top of prisma's ones, use t.field/string/int...
 *   }
 * })
 * ```
 */
export const User = prismaObjectType({
  name: 'User',
  definition(t) {
    t.prismaFields(['*'])
  },
})
