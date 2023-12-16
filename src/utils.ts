import { CommentUI } from "./type";

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
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 30) {
    return `${days} days ago`;
  } else if (months < 12) {
    return `${months} months ago`;
  } else {
    return `${years} years ago`;
  }
};

export function generateUniqueId(): string {
  return `comment-${new Date().getTime()}`; // simple timestamp-based ID
}
