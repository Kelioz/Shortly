type TModeCreate = 'push' | 'unshift'
export const mutateCreate = <T extends object>(
  old: T[] | undefined,
  newEntity: T,
  mode: TModeCreate = 'push'
) => {
  if (!old) {
    return [newEntity]
  }
  switch (mode) {
    case 'push':
      return [...old, newEntity]
    case 'unshift':
      return [newEntity, ...old]
    default:
      throw new Error('Invalid mode')
  }
}
