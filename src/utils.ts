export const formatCreatedAt = (createdAt: string | Date): string => {
  let date: Date;

  if (createdAt instanceof Date) {
    date = createdAt;
  } else if (typeof createdAt === "string") {
    if (createdAt.includes("ago") || createdAt.includes("just now")) {
      // Already in relative format
      return createdAt;
    }
    date = new Date(createdAt);
  } else {
    return "";
  }

  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30);
  const years = Math.round(months / 12);

  if (seconds < 60) {
    return "just now";
  } else if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (days < 30) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (months < 12) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
};

export function generateUniqueId(): string {
  return `comment-${new Date().getTime()}`; // simple timestamp-based ID
}

export function parseDate(date: string | Date): number {
  if (typeof date === "string") {
    const now = new Date();
    if (date.includes("week")) {
      const weeks = parseInt(date);
      now.setDate(now.getDate() - weeks * 7);
    } else if (date.includes("hour")) {
      const hours = parseInt(date);
      now.setHours(now.getHours() - hours);
    }
  } else {
    return date.getTime();
  }
  return new Date().getTime();
}
