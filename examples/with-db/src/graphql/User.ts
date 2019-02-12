import { prismaObjectType } from 'yoga'

/**
 * Expose the `User` type with all the fields of the underlying object type
 *
 * Notes:
 * - If a type is missing, `nexus-prisma` will still pick it up and expose all the fields.
 *   You can therefore remove that file if and expect things to keep working.
 *  - Alternatively, you can do the following:
 * ```
 * export const User = prismaObjectType({
 *   name: 'User',
 *   definition(t) {
 *     // If `t.prismaFields` isn't called, all fields will still be picked up
 *     // If you wish you customize/hide fields, call `t.prismaFields(['id', ...])`  with the desired field names
 *     // If you wish to add custom fields on top of prisma's ones, use t.field/string/int...
 *   }
 * })
 * ```
 */
export const User = prismaObjectType({ name: 'User' })
