export function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}