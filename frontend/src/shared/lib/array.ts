/** Копия списка, где элемент index поменян местами с соседом: shift -1 — слева, 1 — справа. */
export const swap = <T>(list: T[], index: number, shift: number): T[] => {
  const next = [...list];

  [next[index], next[index + shift]] = [next[index + shift], next[index]];

  return next;
};
