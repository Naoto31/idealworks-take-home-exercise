import { defineStore } from "pinia";
import { User } from "../type";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: null as User | null,
    users: null as User[] | null,
  }),
  actions: {
    setCurrentUser(user: User) {
      this.currentUser = user;
    },
    setUsers(users: User[]) {
      this.users = users;
    },
  },
});
