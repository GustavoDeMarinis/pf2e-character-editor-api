type QueryCountOptions = {
  fieldToCount: string;
};

export function mockCount(
  model: any,
  count: number,
  options: QueryCountOptions = {
    fieldToCount: "id",
  }
): any {
  return model.aggregate.mockResolvedValue({
    _count: { [options.fieldToCount]: count },
    _min: undefined,
    _max: undefined,
  });
}
