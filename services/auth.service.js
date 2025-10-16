import bcrypt from 'bcrypt'
import { UserRepository } from '../repositories/local/user.js'
import { config } from '../config/env.js'

/**
 * Service d'authentification
 * Gestion du hashing de mot de passe et de la logique métier
 */

export const AuthService = {
  /**
   * Hasher un mot de passe
   */
  hashPassword: async (password) => {
    return await bcrypt.hash(password, config.bcrypt.rounds)
  },

  /**
   * Comparer un mot de passe avec son hash
   */
  comparePassword: async (password, hash) => {
    return await bcrypt.compare(password, hash)
  },

  /**
   * Créer un nouvel utilisateur avec mot de passe hashé
   */
  signup: async (userData) => {
    // Vérifier si l'email existe déjà
    const emailExists = await UserRepository.emailExists(userData.email)
    if (emailExists) {
      throw new Error('Cet email est déjà utilisé')
    }

    // Hasher le mot de passe
    const hashedPassword = await AuthService.hashPassword(userData.password)

    // Créer l'utilisateur
    const user = await UserRepository.createUser({
      email: userData.email.toLowerCase(),
      username: userData.username,
      password: hashedPassword
    })

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  /**
   * Authentifier un utilisateur
   */
  login: async (email, password) => {
    // Récupérer l'utilisateur
    const user = await UserRepository.findByEmail(email)
    if (!user) {
      throw new Error('Email ou mot de passe incorrect')
    }

    // Vérifier le mot de passe
    const isValidPassword = await AuthService.comparePassword(password, user.password)
    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect')
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  /**
   * Générer un token JWT
   */
  generateToken: (fastify, user) => {
    return fastify.jwt.sign({
      id: user.id,
      email: user.email,
      username: user.username
    })
  },

  /**
   * Vérifier un token JWT
   */
  verifyToken: async (fastify, token) => {
    try {
      return await fastify.jwt.verify(token)
    } catch (error) {
      throw new Error('Token invalide')
    }
  }
}

