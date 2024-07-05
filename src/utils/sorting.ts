import { Prisma } from "@prisma/client";

type SortItem = {
  [k: string]: object | string;
};

export const handleSort = (sort?: string): SortItem[] => {
  if (!sort) return [];
  const rawSortedItems = sort.split(",").map((el) => el.trim());
  const sortedItemsArr = rawSortedItems.map((k) => handleSortItem(k));
  const items: SortItem[] = sortedItemsArr.map((el) => ({
    [el[0]]: el[1],
  }));
  return items;
};

const handleNestedItem = (
  nestedSortItem: string,
  index: number,
  nestedSortItems: string[],
  desc: boolean
): [string, Prisma.SortOrder] | [string, object] => {
  // always ignore direction on nested item pieces
  nestedSortItem = trimDirection(nestedSortItem);
  if (lastTwoNestedProperties(index, nestedSortItems)) {
    // always ignore direction on nested item pieces themselves
    let lastNestedItem = trimDirection(nestedSortItems[index + 1]);
    // set desc signal if the whole item is to be descending
    lastNestedItem = (desc ? "-" : "") + lastNestedItem;
    return finalTwoItems(nestedSortItem, lastNestedItem);
  }
  return itemAndSubItems(nestedSortItem, index, nestedSortItems, desc);
};

const trimDirection = (item: string) => {
  if (item.startsWith("-") || item.startsWith("+")) {
    return item.slice(1).trim();
  }
  return item;
};

const handleSortItem = (
  sortItem: string
): [string, Prisma.SortOrder] | [string, object] => {
  const nestedSortItems = sortItem.split(".");
  if (nestedSortItems.length > 1) {
    // get the direction from the whole item (only)
    let desc = false;
    if (sortItem.startsWith("-")) {
      desc = true;
    }
    return handleNestedItem(nestedSortItems[0], 0, nestedSortItems, desc);
  }
  return handleSingleItem(sortItem);
};

const lastTwoNestedProperties = (index: number, nestedSortItems: string[]) => {
  return index === nestedSortItems.length - 2;
};

const finalTwoItems = (
  nestedSortItem: string,
  lastNestedItem: string
): [string, object] => {
  return [
    nestedSortItem.trim(),
    Object.fromEntries([handleSortItem(lastNestedItem)]),
  ];
};

const itemAndSubItems = (
  nestedSortItem: string,
  index: number,
  nestedSortItems: string[],
  desc: boolean
): [string, Prisma.SortOrder] | [string, object] => {
  return [
    nestedSortItem.trim(),
    Object.fromEntries([
      handleNestedItem(
        nestedSortItems[index + 1],
        index + 1,
        nestedSortItems,
        desc
      ),
    ]),
  ];
};

const handleSingleItem = (sortItem: string): [string, Prisma.SortOrder] => {
  if (sortItem.startsWith("-")) {
    return [trimDirection(sortItem), Prisma.SortOrder.desc];
  }
  if (sortItem.startsWith("+")) {
    return [trimDirection(sortItem), Prisma.SortOrder.asc];
  }
  return [sortItem.trim(), Prisma.SortOrder.asc];
};
