import { Comment } from "@/type";

export function saveCommentToLocalStorage(comment: Comment) {
  const storedComments = localStorage.getItem("comments");
  const comments: Comment[] = storedComments ? JSON.parse(storedComments) : [];
  comments.push(comment);
  localStorage.setItem("comments", JSON.stringify(comments));
}

export function getStoredCommentsInLocalStorage(): Comment[] {
  const storedComments = localStorage.getItem("comments");
  return storedComments ? JSON.parse(storedComments) : [];
}

export function updateCommentsToLocalStorage(
  commentId: string,
  action: "delete" | "update",
  value?: { message: string }
) {
  const storedComments = getStoredCommentsInLocalStorage();
  let updated = [] as Comment[];
  switch (action) {
    case "delete":
      updated = storedComments.filter((value) => value.id !== commentId);
      break;
    case "update":
      updated = storedComments.map((el) => {
        if (el.id !== commentId) return el;
        return {
          ...el,
          message: value!.message,
        };
      });
      break;
  }
  localStorage.setItem("comments", JSON.stringify(updated));
}
