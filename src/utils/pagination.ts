import { PaginationOptions } from "./shared-types";

type QueryCountOptions = {
  fieldToCount: string;
};

export const getPaginationOptions = ({
  pageOffset,
  pageLimit,
}: {
  pageOffset?: number;
  pageLimit?: number;
}): PaginationOptions => {
  const offset = pageOffset ?? 0;
  const limit = pageLimit ?? 10;
  return {
    skip: offset,
    take: limit,
  };
};

export const getQueryCount = async (
  model: any,
  where: any,
  options: QueryCountOptions = {
    fieldToCount: "id",
  }
): Promise<number> => {
  const result = await model.aggregate({
    _count: { [options.fieldToCount]: true },
    where,
  });
  return result._count[options.fieldToCount];
};
