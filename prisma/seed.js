import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Nettoyer les données existantes
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Données existantes supprimées');

  // Créer des utilisateurs
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        username: 'alice',
        password: '$2b$10$K7L1YGpH8xV4oMZQjKX.ZuGJ0yTxRZqZ8WZqYzqLqYZqYzqLqYZqY' // hash de "password123"
      }
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        username: 'bob',
        password: '$2b$10$K7L1YGpH8xV4oMZQjKX.ZuGJ0yTxRZqZ8WZqYzqLqYZqYzqLqYZqY'
      }
    })
  ]);

  console.log(`✅ ${users.length} utilisateurs créés`);

  // Créer des catégories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Technologie',
        description: 'Articles sur la technologie, le développement web et les innovations'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Voyages',
        description: 'Récits de voyage et conseils pour les aventuriers'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Cuisine',
        description: 'Recettes et astuces culinaires'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Sport',
        description: 'Actualités sportives et conseils fitness'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Culture',
        description: 'Livres, films, musique et art'
      }
    })
  ]);

  console.log(`✅ ${categories.length} catégories créées`);

  // Créer des posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Introduction à Node.js',
        content: 'Node.js est un environnement d\'exécution JavaScript côté serveur. Il permet de créer des applications web performantes et scalables.',
        published: true,
        categoryId: categories[0].id
      }
    }),
    prisma.post.create({
      data: {
        title: 'Les bases de Fastify',
        content: 'Fastify est un framework web rapide et efficace pour Node.js. Il offre d\'excellentes performances et une grande flexibilité.',
        published: true,
        categoryId: categories[0].id
      }
    }),
    prisma.post.create({
      data: {
        title: 'Découvrir le Japon',
        content: 'Le Japon est un pays fascinant mêlant traditions ancestrales et technologie de pointe. De Tokyo à Kyoto, chaque ville a son charme.',
        published: true,
        categoryId: categories[1].id
      }
    }),
    prisma.post.create({
      data: {
        title: 'Road trip en Islande',
        content: 'L\'Islande offre des paysages à couper le souffle : volcans, glaciers, geysers et aurores boréales.',
        published: true,
        categoryId: categories[1].id
      }
    }),
    prisma.post.create({
      data: {
        title: 'Recette de croissants maison',
        content: 'Faire ses propres croissants n\'est pas si compliqué ! Il faut juste de la patience et suivre les étapes avec précision.',
        published: true,
        categoryId: categories[2].id
      }
    }),
    prisma.post.create({
      data: {
        title: 'Les secrets de la pâtisserie française',
        content: 'La pâtisserie française est réputée dans le monde entier. Découvrez les techniques des grands chefs.',
        published: false,
        categoryId: categories[2].id
      }
    }),
    prisma.post.create({
      data: {
        title: 'Programme d\'entraînement pour débutants',
        content: 'Commencer le sport peut être intimidant. Voici un programme progressif pour se mettre en forme.',
        published: true,
        categoryId: categories[3].id
      }
    }),
    prisma.post.create({
      data: {
        title: 'Les bienfaits du yoga',
        content: 'Le yoga combine exercices physiques, respiration et méditation pour un bien-être global.',
        published: true,
        categoryId: categories[3].id
      }
    }),
    prisma.post.create({
      data: {
        title: 'Top 10 des films de science-fiction',
        content: 'De Blade Runner à Interstellar, découvrez les films qui ont marqué le genre.',
        published: true,
        categoryId: categories[4].id
      }
    }),
    prisma.post.create({
      data: {
        title: 'Les classiques de la littérature française',
        content: 'Victor Hugo, Gustave Flaubert, Albert Camus... Les auteurs incontournables.',
        published: true,
        categoryId: categories[4].id
      }
    }),
    prisma.post.create({
      data: {
        title: 'Introduction à Prisma ORM',
        content: 'Prisma est un ORM moderne pour Node.js et TypeScript qui simplifie l\'accès aux bases de données.',
        published: false,
        categoryId: categories[0].id
      }
    }),
    prisma.post.create({
      data: {
        title: 'Backpacking en Asie du Sud-Est',
        content: 'Conseils et astuces pour voyager à petit budget en Thaïlande, Vietnam et Cambodge.',
        published: true,
        categoryId: categories[1].id
      }
    }),
    prisma.post.create({
      data: {
        title: 'Article sans catégorie',
        content: 'Ceci est un exemple d\'article sans catégorie assignée.',
        published: true,
        categoryId: null
      }
    })
  ]);

  console.log(`✅ ${posts.length} posts créés`);

  // Afficher un résumé
  const totalCategories = await prisma.category.count();
  const totalPosts = await prisma.post.count();
  const totalUsers = await prisma.user.count();
  const publishedPosts = await prisma.post.count({ where: { published: true } });

  console.log('\n📊 Résumé du seeding :');
  console.log(`   - ${totalUsers} utilisateurs`);
  console.log(`   - ${totalCategories} catégories`);
  console.log(`   - ${totalPosts} posts (${publishedPosts} publiés)`);
  console.log('\n✨ Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur pendant le seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

