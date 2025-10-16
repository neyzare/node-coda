# Tests API

## Lancer les tests

```bash
# Terminal 1 : Démarre le serveur
npm run dev

# Terminal 2 : Lance les tests
npm test
```

## Routes testées

### ✅ Authentification
- `POST /signup` - Créer un utilisateur
- `POST /login` - Se connecter

### ✅ Route principale
- `GET /` - Hello world

### ✅ Posts
- `GET /posts` - Liste des posts
- `GET /posts?page=1&limit=5` - Pagination
- `GET /posts/:id` - Un post
- `POST /posts` - Créer un post
- `PUT /posts/:id` - Modifier (authentifié)
- `DELETE /posts/:id` - Supprimer (authentifié)

### ✅ Catégories
- `GET /categories` - Liste des catégories
- `GET /categories/:id` - Une catégorie
- `POST /categories` - Créer (authentifié)
- `PUT /categories/:id` - Modifier (authentifié)
- `DELETE /categories/:id` - Supprimer (authentifié)

## Total : 24 tests

