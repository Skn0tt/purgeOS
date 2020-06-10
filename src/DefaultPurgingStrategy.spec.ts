import {
  makeDefaultPurgingStrategy,
  chooseEvenlyDistributedSubset,
  range,
} from "./DefaultPurgingStrategy";
import { ObjectData } from "./ObjectStorageClient";

describe("range", () => {
  it("works", () => {
    expect(range(3)).toEqual([0, 1, 2])

    expect(range(2, 5)).toEqual([2, 3, 4])
  })
})

describe("chooseEvenlyDistributedSubset", () => {
  describe("given 1..9", () => {
    describe("and m = 5", () => {
      it("yields 1, 3, 5, 7, 9", () => {
        expect(
          chooseEvenlyDistributedSubset(
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            (v) => v,
            5
          )
        ).toEqual([1, 3, 5, 7, 9]);
      });
    });
  });
});

describe("DefaultPurgingStrategy", () => {
  function makeObject(date: string): ObjectData {
    return {
      id: "",
      name: "",
      updatedAt: new Date(date),
    };
  }

  it("works as intended", () => {
    const strategy = makeDefaultPurgingStrategy({} as any);

    const today = "2020-06-10T17:29:04.158Z";

    const backups = [
      "2020-06-10T11:00:00.000Z",
      "2020-06-10T11:00:00.000Z",
      "2020-06-10T11:00:00.000Z",
      "2020-06-10T11:00:00.000Z",
      "2020-06-10T12:00:00.000Z",
      "2020-06-10T13:00:00.000Z",
      "2020-06-10T14:00:00.000Z",
      "2020-06-10T15:00:00.000Z",
      "2020-06-10T15:20:00.000Z",
      "2020-06-10T16:40:00.000Z",
      "2020-06-10T16:00:00.000Z",
      "2020-06-10T16:30:00.000Z",
      "2020-06-10T17:00:00.000Z",
    ];

    const expectedToRetain = ["2020-06-10T17:29:04.158Z"];

    const retainedBackups = strategy(backups.map(makeObject), new Date(today));

    expect(retainedBackups.map((b) => b.updatedAt.toISOString())).toEqual(
      expectedToRetain
    );
  });
});
