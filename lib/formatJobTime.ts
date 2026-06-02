export function formatJobTime(postedDate?: string, postedTime?: string, createdAt?: number): { label: string; icon: string } {
  if (createdAt) {
    const now = Date.now();
    const diffMs = now - createdAt;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours < 24 && diffHours >= 0) {
      if (diffMinutes < 60) {
        return { label: `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`, icon: "🕒" };
      }
      return { label: `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`, icon: "🕒" };
    } else {
      const date = new Date(createdAt);
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
      return { label: date.toLocaleDateString('en-GB', options), icon: "📅" };
    }
  }

  // Fallback for static mock data
  if (postedTime) {
    const isWithin24Hours = postedTime.includes('hour') || postedTime.includes('min') || postedTime.includes('now');
    if (isWithin24Hours) {
      return { label: postedTime, icon: "🕒" };
    }
  }

  if (postedDate) {
    const date = new Date(postedDate);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return { label: date.toLocaleDateString('en-GB', options), icon: "📅" };
  }

  return { label: "Unknown Date", icon: "📅" };
}
