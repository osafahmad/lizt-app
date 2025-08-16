import {Item, List, MainList} from '../redux/slices/list.slice';

export function getPendingItems(items: Item[]) {
  let total = 0;
  let pending = 0;

  items.forEach(el => {
    total += el.quantity;
    pending += el.quantityDone || 0;
  });

  return total - pending;
}

export function getPendingItemsMainList(listItems: List[]) {
  let total = 0;
  let pending = 0;

  listItems.forEach(mainList => {
    mainList.items.forEach(el => {
      total += el.quantity;
      pending += el.quantityDone || 0;
    });
  });

  return total - pending;
}

export function getElementById(items: MainList[], id: string) {
  return items.find(el => el.id === id);
}
