import { prisma } from "../../db.js";



export const PostRepositorySQL = {

  getPosts: async (page, limit) => {
    const offset = (page - 1) * limit
    
    const posts = await prisma.$queryRaw`
      SELECT 
        id, 
        title, 
        content, 
        published, 
        "createdAt", 
        "updatedAt"
      FROM post
      ORDER BY "createdAt" DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `
    
    return posts
  },

  
  countPosts: async () => {
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM post
    `
    return Number(result[0].count)
  },


  getPost: async (id) => {
    const posts = await prisma.$queryRaw`
      SELECT 
        id, 
        title, 
        content, 
        published, 
        "createdAt", 
        "updatedAt"
      FROM post
      WHERE id = ${parseInt(id)}
      LIMIT 1
    `
    
    return posts.length > 0 ? posts[0] : null
  },

  /**
   * Créer un nouveau post
   */
  createPost: async (data) => {
    const { title, content, published } = data
    
    const result = await prisma.$queryRaw`
      INSERT INTO post (title, content, published, "createdAt", "updatedAt")
      VALUES (
        ${title}, 
        ${content || null}, 
        ${published || false}, 
        NOW(), 
        NOW()
      )
      RETURNING id, title, content, published, "createdAt", "updatedAt"
    `
    
    return result[0]
  },

 
  updatePost: async (id, data) => {
    const updates = []
    const values = []
    
    if (data.title !== undefined) {
      updates.push(`title = $${updates.length + 1}`)
      values.push(data.title)
    }
    
    if (data.content !== undefined) {
      updates.push(`content = $${updates.length + 1}`)
      values.push(data.content)
    }
    
    if (data.published !== undefined) {
      updates.push(`published = $${updates.length + 1}`)
      values.push(data.published)
    }
    
    updates.push(`"updatedAt" = NOW()`)
    
    if (updates.length === 0) return null
    
    const query = `
      UPDATE post 
      SET ${updates.join(', ')}
      WHERE id = ${parseInt(id)}
    `
    
    await prisma.$executeRaw`
      UPDATE post 
      SET 
        title = COALESCE(${data.title}, title),
        content = COALESCE(${data.content}, content),
        published = COALESCE(${data.published}, published),
        "updatedAt" = NOW()
      WHERE id = ${parseInt(id)}
    `
    
    return await PostRepositorySQL.getPost(id)
  },

 
  deletePost: async (id) => {
    const post = await PostRepositorySQL.getPost(id)
    
    if (!post) return null
    
    await prisma.$executeRaw`
      DELETE FROM post
      WHERE id = ${parseInt(id)}
    `
    
    return post
  },

 
  searchByTitle: async (searchTerm) => {
    const posts = await prisma.$queryRaw`
      SELECT 
        id, 
        title, 
        content, 
        published, 
        "createdAt", 
        "updatedAt"
      FROM post
      WHERE title ILIKE ${`%${searchTerm}%`}
      ORDER BY "createdAt" DESC
    `
    
    return posts
  },

  /**
   * Récupérer uniquement les posts publiés
   */
  getPublishedPosts: async (page, limit) => {
    const offset = (page - 1) * limit
    
    const posts = await prisma.$queryRaw`
      SELECT 
        id, 
        title, 
        content, 
        published, 
        "createdAt", 
        "updatedAt"
      FROM post
      WHERE published = true
      ORDER BY "createdAt" DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `
    
    return posts
  },


  getRecentPosts: async () => {
    const posts = await prisma.$queryRaw`
      SELECT 
        id, 
        title, 
        content, 
        published, 
        "createdAt", 
        "updatedAt"
      FROM post
      WHERE "createdAt" >= NOW() - INTERVAL '24 hours'
      ORDER BY "createdAt" DESC
    `
    
    return posts
  }
}

