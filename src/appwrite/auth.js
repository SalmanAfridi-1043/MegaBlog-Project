import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl)
      .setProject(conf.appWriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    const userAccount = await this.account.create(
      ID.unique(),
      email,
      password,
      name,
    );

    if (userAccount) {
      return await this.login({ email, password });
    }

    return null;
  }

  async login({ email, password }) {
    return await this.account.createEmailPasswordSession(email, password);
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser :: error", error);
    }

    return null;
  }

  async logout() {
    return await this.account.deleteSession("current");
  }

  async updateName(name) {
    return await this.account.updateName(name);
  }

  async updateEmail(email, password) {
    return await this.account.updateEmail(email, password);
  }

  async updatePassword(newPassword, oldPassword) {
    return await this.account.updatePassword(newPassword, oldPassword);
  }

  async deleteAllSessions() {
    return await this.account.deleteSessions();
  }
}

const authService = new AuthService();
export default authService;
