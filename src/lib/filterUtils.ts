export const filterByCategory = <T extends { category: string }>(
  items: T[],
  category: string | null
): T[] => {
  if (!category || category === 'all') return items;
  return items.filter(item => item.category === category);
};

export const filterBySearch = <T extends { title?: string; name?: string; description?: string }>(
  items: T[],
  searchTerm: string
): T[] => {
  if (!searchTerm.trim()) return items;

  const term = searchTerm.toLowerCase();
  return items.filter(item => {
    const title = (item.title || item.name || '').toLowerCase();
    const description = (item.description || '').toLowerCase();
    return title.includes(term) || description.includes(term);
  });
};

export const filterByMultiple = <T extends { category?: string; title?: string; name?: string; description?: string }>(
  items: T[],
  category: string | null,
  searchTerm: string
): T[] => {
  let filtered = filterByCategory(items, category);
  return filterBySearch(filtered, searchTerm);
};
