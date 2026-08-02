export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  // Calculate difference in days
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays === -1) return "yesterday";
  
  if (diffDays > 0) {
    if (diffDays < 30) return `in ${diffDays} days`;
    const diffMonths = Math.floor(diffDays / 30);
    return `in ${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
  } else {
    const pastDays = Math.abs(diffDays);
    if (pastDays < 30) return `${pastDays} days ago`;
    const pastMonths = Math.floor(pastDays / 30);
    return `${pastMonths} month${pastMonths > 1 ? 's' : ''} ago`;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
