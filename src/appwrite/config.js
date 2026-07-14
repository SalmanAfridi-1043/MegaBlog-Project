import conf from "../conf/conf.js";
import { Client, ID, Storage, Databases, Query, Permission, Role } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl)
      .setProject(conf.appWriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, userID, status }) {
    return await this.databases.createDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      slug,
      {
        title,
        content,
        featuredImage,
        userID,
        status,
      },
    );
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    return await this.databases.updateDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      slug,
      {
        title,
        content,
        featuredImage,
        status,
      },
    );
  }

  async deletePost(slug) {
    await this.databases.deleteDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      slug,
    );
    return true;
  }

  async getPost(slug) {
    return await this.databases.getDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      slug,
    );
  }

  async getAllPosts(queries = [Query.equal("status", "active")]) {
    return await this.databases.listDocuments(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      queries,
    );
  }

  // delete all posts (and their images) belonging to a userID
  async deleteUserPosts(userID) {
    const res = await this.databases.listDocuments(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      [Query.equal("userID", userID)],
    );
    const posts = res.documents || [];
    for (const post of posts) {
      // delete featured image from storage
      if (post.featuredImage) {
        try { await this.deleteFile(post.featuredImage); } catch (_) {}
      }
      // delete the document
      await this.databases.deleteDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        post.$id,
      );
    }
    return posts.length;
  }

  // file upload service
  async uploadFile(file) {
    return await this.bucket.createFile(
      conf.appWriteBucketId,
      ID.unique(),
      file,
      [
        Permission.read(Role.any()),
      ]
    );
  }

  // delete file
  async deleteFile(fileId) {
    await this.bucket.deleteFile(conf.appWriteBucketId, fileId);
    return true;
  }

  // get file preview
  getFilePreview(fileId) {
    if (!fileId) return "";
    return this.bucket.getFileView(conf.appWriteBucketId, fileId);
  }
}

const service = new Service();
export default service;
