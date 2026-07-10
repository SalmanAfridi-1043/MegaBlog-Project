import conf from "../conf/conf.js";
import { Client, ID, Storage, Databases, Query } from "appwrite";

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

  async createPost({ title, slug, content, featuredImage, userId, status }) {
    return await this.databases.createDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      slug,
      {
        title,
        content,
        featuredImage,
        userId,
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

  // file upload service
  async uploadFile(file) {
    return await this.bucket.createFile(
      conf.appWriteBucketId,
      ID.unique(),
      file,
    );
  }

  // delete file
  async deleteFile(fileId) {
    await this.bucket.deleteFile(conf.appWriteBucketId, fileId);
    return true;
  }

  // get file preview
  getFilePreview(fileId) {
    return this.bucket.getFilePreview(conf.appWriteBucketId, fileId);
  }
}

const service = new Service();
export default service;
