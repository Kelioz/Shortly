import { TBaseEntity } from '../types'

export function mutateDelete<T extends TBaseEntity>(
  old: T[] | undefined,
  deletedId: string
): T[]
export function mutateDelete<T extends object>(
  old: T[] | undefined,
  deletedId: T[keyof T],
  idField: keyof T
): T[]
export function mutateDelete(
  old: any[] | undefined,
  deletedId: any,
  idField?: any
) {
  if (!old) {
    return []
  }
  if (idField) {
    return old.filter((item) => item[idField] !== deletedId) || []
  } else {
    return old.filter((item) => item.id !== deletedId) || []
  }
}
