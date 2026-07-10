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
    return await this.account.createEmailSession(email, password);
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      return error;
    }
  }

  async logout() {
    return await this.account.deleteSessions("current");
  }
}

const authService = new AuthService();
export default authService;
