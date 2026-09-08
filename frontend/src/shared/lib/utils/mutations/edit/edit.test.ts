import { mutateEdit } from './edit'

describe('mutate edit', () => {
  it('should work', () => {
    const old = [
      {
        id: '1',
        name: 'name old',
      },
      {
        id: '2',
        name: 'name old',
      },
    ]
    const result = mutateEdit(old, {
      id: '1',
      name: 'name new',
    })
    expect(result.length).toBe(2)
    expect(result[0].name).toBe('name new')
  })

  it('should work with idField', () => {
    const old = [
      {
        idTest: '1',
        name: 'name old',
      },
      {
        idTest: '2',
        name: 'name old',
      },
    ]
    const result = mutateEdit(
      old,
      {
        idTest: '1',
        name: 'name new',
      },
      'idTest'
    )
    expect(result.length).toBe(2)
    expect(result[0].name).toBe('name new')
  })

  it('should return empty array', () => {
    const result = mutateEdit(undefined, {
      id: '1',
      name: 'name new',
    })
    expect(result.length).toBe(0)
    expect(result).toEqual([])
  })
})
