import {
  findUser,
  buildCommentTree,
  findCommentById,
} from "@/helpers/comment.helper";
import data from "@/data.json";

describe("buildCommentTree", () => {
  it("builds a nested comment tree", () => {
    const tree = buildCommentTree(data.comments);
    expect(tree).toBeDefined();
    expect(tree.length).toBeGreaterThan(0);
    expect(tree[0].replies).toBeDefined();
    expect(tree[0].replies?.length).toBeGreaterThan(0);
  });
});

describe("findUser", () => {
  it("finds a user by ID", () => {
    const user = findUser("user_1");
    expect(user).toBeDefined();
    expect(user?.name).toBe("Cassandra Dunn");
  });

  it("returns undefined for a non-existent user ID", () => {
    const user = findUser("nonexistent");
    expect(user).toBeUndefined();
  });
});

describe("findCommentById", () => {
  it("finds a comment by ID", () => {
    const nestedComments = buildCommentTree(data.comments);
    const comment = findCommentById(nestedComments, "comment-1");
    expect(comment).toBeDefined();
    expect(comment?.id).toBe("comment-1");
    expect(comment?.message).toContain(
      "having some trouble with my new smartphone"
    );
  });
});
