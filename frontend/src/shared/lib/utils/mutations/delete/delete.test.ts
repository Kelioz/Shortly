import { mutateDelete } from './delete'

describe('mutateDelete', () => {
  it('should work', () => {
    const old = [
      {
        id: '1',
      },
      {
        id: '2',
      },
    ]
    const result = mutateDelete(old, '2')
    expect(result.length).toBe(1)
    expect(result[0].id).toBe('1')
  })
  it('should work with idField', () => {
    const old = [
      {
        idTest: '1',
      },
      {
        idTest: '2',
      },
    ]
    const result = mutateDelete(old, '2', 'idTest')
    expect(result.length).toBe(1)
    expect(result[0].idTest).toBe('1')
  })
  it('should return empty array', () => {
    const result = mutateDelete(undefined, '2')
    expect(result.length).toBe(0)
    expect(result).toEqual([])
  })

  it('should return same array if deleted item not found', () => {
    const old = [
      {
        id: '1',
      },
      {
        id: '2',
      },
    ]
    const result = mutateDelete(old, '3')
    expect(result.length).toBe(2)
    expect(result).toEqual(old)
  })
})
