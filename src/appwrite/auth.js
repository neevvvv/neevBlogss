import { Client, Account } from 'appwrite';
import conf from '../conf/conf';

class AuthService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    const userId = email.split('@')[0];
    return this.account.create(userId, email, password, name);
  }

  async login({ email, password }) {
    return this.account.createEmailPasswordSession(email, password);
  }

  async logout() {
    return this.account.deleteSessions();
  }

  async getCurrentUser() {
    try {
      // this will throw if no session / missing scope
      const user = await this.account.get();
      return user;  // contains $id, name, email, prefs, etc.
    } catch (err) {
      if (err.code === 401 || err.message.includes('missing scope')) {
        return null;
      }
      throw err;
    }
  }

  async updatePrefs(prefs) {
    return this.account.updatePrefs(prefs);
  }
}

export default new AuthService();