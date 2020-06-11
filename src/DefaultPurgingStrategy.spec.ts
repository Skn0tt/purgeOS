import {
  makeDefaultPurgingStrategy,
  chooseEvenlyDistributedSubset,
} from './DefaultPurgingStrategy'
import {ObjectData} from './StorageBackend'

describe('chooseEvenlyDistributedSubset', () => {
  describe('given 1..9', () => {
    describe('and m = 5', () => {
      it('yields 1, 4, 6, 9', () => {
        expect(
          chooseEvenlyDistributedSubset([9, 1, 2, 3, 4, 5, 6, 7, 8], {
            range: [1, 9],
            size: 4,
          })
        ).toEqual([1, 4, 6, 9])
      })
    })
  })

  describe('given 1..9', () => {
    describe('and range = [1, 5] size = 3', () => {
      it('yields 1, 3, 5', () => {
        expect(
          chooseEvenlyDistributedSubset([9, 1, 2, 3, 4, 5, 6, 7, 8], {
            range: [1, 5],
            size: 3,
          })
        ).toEqual([1, 3, 5])
      })
    })
  })
})

describe('DefaultPurgingStrategy', () => {
  function makeObject(date: string | number | Date): ObjectData {
    return {
      id: '',
      name: '',
      updatedAt: new Date(date),
      _file: null,
    }
  }

  it('works as intended', () => {
    const strategy = makeDefaultPurgingStrategy({} as any)

    const today = '2020-06-11T00:00:00.000Z'

    function get24HrsOfBackupsForDay(year: number, month: number, day: number) {
      return new Array(24)
      .fill(0)
      .map((_, i) => Date.UTC(year, month - 1, day, i))
    }

    const backups = [
      ...get24HrsOfBackupsForDay(2020, 6, 10),
    ]

    const expectedToPurge = [
      '2020-06-10T17:29:04.158Z',
      '2020-06-10T15:20:00.000Z',
      '2020-06-10T16:40:00.000Z',
      '2020-06-10T16:30:00.000Z',
    ]

    const purgedBackups = strategy(
      [...backups, ...expectedToPurge].map(makeObject),
      new Date(today)
    )

    expect(purgedBackups.map(b => b.updatedAt.toISOString())).toEqual(
      expectedToPurge
    )
  })
})
