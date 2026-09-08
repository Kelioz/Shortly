import { mutateCreate } from './create'

describe('mutate create', () => {
  it('should create Item', () => {
    const old = [
      {
        name: 'test',
      },
      {
        name: 'test 2',
      },
    ]
    const result = mutateCreate(old, {
      name: 'test 3',
    })
    expect(result.length).toBe(3)
    expect(result.slice(-1)[0]).toEqual({
      name: 'test 3',
    })
  })
  it('should unshift Item', () => {
    const old = [
      {
        name: 'test',
      },
      {
        name: 'test 2',
      },
    ]
    const result = mutateCreate(
      old,
      {
        name: 'test 3',
      },
      'unshift'
    )
    expect(result.length).toBe(3)
    expect(result[0]).toEqual({
      name: 'test 3',
    })
  })
  it('should return array with new Item', () => {
    const result = mutateCreate(undefined, {
      name: 'test 3',
    })
    expect(result.length).toBe(1)
    expect(result[0]).toEqual({
      name: 'test 3',
    })
  })
})
