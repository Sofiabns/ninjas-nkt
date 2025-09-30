export const generateId = (prefix: string, existingIds: string[]): string => {
  const numbers = existingIds
    .filter((id) => id.startsWith(prefix))
    .map((id) => {
      const num = parseInt(id.replace(prefix + "-", ""), 10);
      return isNaN(num) ? 0 : num;
    });

  const nextNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return `${prefix}-${String(nextNum).padStart(2, "0")}`;
};
