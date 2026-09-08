import { TBaseEntity } from '../types'

export function mutateEdit<T extends TBaseEntity>(
  old: T[] | undefined,
  replace: T
): T[]
export function mutateEdit<T extends object>(
  old: T[] | undefined,
  replace: T,
  idField: keyof T
): T[]
export function mutateEdit(
  old: any[] | undefined,
  replace: any,
  idField?: any
) {
  if (!old) {
    return []
  }
  if (idField) {
    return old.map((item) =>
      item[idField] === replace[idField] ? replace : item
    )
  }

  return old.map((item) => (item.id === replace.id ? replace : item))
}
