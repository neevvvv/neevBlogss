// src/appwrite/service.js
import { Client, Databases, Storage, ID, Query, Permission, Role } from 'appwrite';
import conf from '../conf/conf';

class AppwriteService {
  constructor() {
    // safe fallback for endpoint
    const endpoint = (conf && conf.appwriteUrl) ? conf.appwriteUrl : "";

    this.client = new Client();

    if (endpoint) {
      try {
        this.client.setEndpoint(endpoint);
        console.info('[AppwriteService] endpoint set:', endpoint);
      } catch (err) {
        console.error('[AppwriteService] failed to set endpoint:', err);
      }
    } else {
      console.warn('[AppwriteService] VITE_APPWRITE_URL missing — endpoint not set');
    }

    if (conf && conf.appwriteProjectId) {
      try {
        this.client.setProject(conf.appwriteProjectId);
        console.info('[AppwriteService] project set:', conf.appwriteProjectId);
      } catch (err) {
        console.error('[AppwriteService] failed to set project:', err);
      }
    } else {
      console.warn('[AppwriteService] VITE_APPWRITE_PROJECT_ID missing');
    }

    // initialize service helpers and validate them
    try {
      this.databases = new Databases(this.client);
      this.storage   = new Storage(this.client);

      if (!this.databases || typeof this.databases.listDocuments !== 'function') {
        console.error('[AppwriteService] databases not initialized correctly', this.databases);
      } else {
        console.info('[AppwriteService] databases initialized OK');
      }

      if (!this.storage || typeof this.storage.createFile !== 'function') {
        console.error('[AppwriteService] storage not initialized correctly', this.storage);
      } else {
        console.info('[AppwriteService] storage initialized OK');
      }
    } catch (err) {
      console.error('[AppwriteService] failed to init Databases/Storage', err);
      this.databases = null;
      this.storage = null;
    }
  }

  // — File upload & preview URL —
  async uploadFile(file) {
    if (!this.storage || typeof this.storage.createFile !== 'function') {
      throw new Error('Appwrite storage is not initialized');
    }
    const res = await this.storage.createFile(
      conf.appwriteBucketId, // bucket id
      ID.unique(),           // file id
      file
    );
    return res.$id;
  }

  getFileView(fileId) {
    if (!this.storage || typeof this.storage.getFileView !== 'function') {
      throw new Error('Appwrite storage is not initialized');
    }
    return this.storage.getFileView(conf.appwriteBucketId, fileId);
  }

  getFilePreview(fileId) {
    if (!this.storage || typeof this.storage.getFilePreview !== 'function') {
      throw new Error('Appwrite storage is not initialized');
    }
    return this.storage.getFilePreview(conf.appwriteBucketId, fileId);
  }

  // — Posts CRUD —
  async getPosts(filters = [ Query.equal('status','active') ]) {
    if (!this.databases || typeof this.databases.listDocuments !== 'function') {
      throw new Error('Appwrite databases not initialized');
    }
    const { documents } = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      filters
    );
    return documents;
  }

  async getPostBySlug(slug) {
    if (!this.databases || typeof this.databases.listDocuments !== 'function') {
      throw new Error('Appwrite databases not initialized');
    }
    const { documents } = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      [ Query.equal('slug', slug) ]
    );
    if (!documents.length) throw new Error(`Post not found: ${slug}`);
    return documents[0];
  }

  createPost(data) {
    if (!this.databases || typeof this.databases.createDocument !== 'function') {
      throw new Error('Appwrite databases not initialized');
    }
    const sanitizeSlug = (slug) => {
      if (typeof slug !== 'string') return null;
      return slug
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, '')
        .substring(0, 36);
    };
    const docId = sanitizeSlug(data.slug);
    return this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      docId || ID.unique(),
      data
    );
  }

  updatePost(id, data) {
    if (!this.databases || typeof this.databases.updateDocument !== 'function') {
      throw new Error('Appwrite databases not initialized');
    }
    return this.databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      id, data
    );
  }

  deletePost(id) {
    if (!this.databases || typeof this.databases.deleteDocument !== 'function') {
      throw new Error('Appwrite databases not initialized');
    }
    return this.databases.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      id
    );
  }

  async countLikes(postId, type) {
    if (!this.databases || typeof this.databases.listDocuments !== 'function') {
      throw new Error('Appwrite databases not initialized');
    }
    const { total } = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteLikesCollectionId,
      [
        Query.equal('postId', postId),
        Query.equal('type', type)
      ],
      0,
      0
    );
    return total;
  }

  // — Likes toggle 
  async toggleLike(postId, userId, type) {
    if (!this.databases || typeof this.databases.listDocuments !== 'function') {
      throw new Error('Appwrite databases not initialized');
    }
    const { documents } = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteLikesCollectionId,
      [
        Query.equal('postId', postId),
        Query.equal('userId', userId)
      ]
    );
    const existing = documents[0] || null;

    if (existing) {
      if (existing.type === type) {
        // remove
        return this.databases.deleteDocument(
          conf.appwriteDatabaseId,
          conf.appwriteLikesCollectionId,
          existing.$id
        );
      } else {
        // switch
        return this.databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteLikesCollectionId,
          existing.$id,
          { type }
        );
      }
    } else {
      // create
      return this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteLikesCollectionId,
        ID.unique(),
        { postId, userId, type },
        [
          Permission.read(Role.any()),
          Permission.write(Role.user(userId)),
          Permission.delete(Role.user(userId))
        ]
      );
    }
  }

  // — Comments —
  async getComments(postId) {
    if (!this.databases || typeof this.databases.listDocuments !== 'function') {
      throw new Error('Appwrite databases not initialized');
    }
    const { documents } = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCommentsCollectionId,
      [
        Query.equal('postId', postId),
        Query.orderDesc('createdAt')
      ]
    );
    return documents;
  }

  async createComment({ postId, userId, userName, userImage, content }) {
    if (!this.databases || typeof this.databases.createDocument !== 'function') {
      throw new Error('Appwrite databases not initialized');
    }
    return this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCommentsCollectionId,
      ID.unique(),
      { postId, userId, userName, userImage, content, createdAt: new Date().toISOString() },
      [
        Permission.read(Role.any()),
        Permission.write(Role.users()),
        Permission.delete(Role.user(userId))
      ]
    );
  }
}

export default new AppwriteService();
