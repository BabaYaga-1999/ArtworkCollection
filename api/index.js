import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from  'express-oauth2-jwt-bearer'

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256',
  credentialsRequired: false,
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

app.get("/ping", (req, res) => {
  res.send("pong");
});

// every one can see all artworks
app.get("/todos", async (req, res) => {
  console.log('fetching all artworks')
  const todos = await prisma.todoItem.findMany();
  res.json(todos);
});

// creates a todo item
app.post("/todos", requireAuth, async (req, res) => {
  console.log('creating a todo item')
  const auth0Id = req.auth.payload.sub;

  const { title } = req.body;

  if (!title) {
    res.status(400).send("title is required");
  } else {
    const newItem = await prisma.todoItem.create({
      data: {
        title,
        author: { connect: { auth0Id } },
      },
    });

    res.status(201).json(newItem);
  }
});

// deletes a todo item by id
app.delete("/todos/:id", requireAuth, async (req, res) => {
  console.log('deleting a todo item by id')
  const id = parseInt(req.params.id, 10);

  try {
    // Start a transaction
    const result = await prisma.$transaction([
      prisma.comment.deleteMany({
        where: {
          todoItemId: id,
        },
      }),
      prisma.favorite.deleteMany({
        where: {
          todoItemId: id,
        },
      }),
      prisma.todoItem.delete({
        where: {
          id: id,
        },
      }),
    ]);
    
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occured while trying to delete the todo item' });
  }
});

// get a todo item by id
app.get("/todos/:id", async (req, res) => {
  console.log('fetching a todo item by id')
  const id = parseInt(req.params.id, 10);  // 把id转化为整数
  // if (isNaN(id)) {
  //   return; // should have warnings here
  // }
  if (isNaN(id)) {
    return res.status(404).send("id is NaN!");
  }
  const todoItem = await prisma.todoItem.findUnique({
    where: {
      id,
    },
    include: {
      comments: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          text: true,
          author: {
            select: {
              name: true,
            },
          },
        },
      },
      favorites: true,  // include favorites data
    },
  });
  res.json(todoItem);
});

// updates a todo item by id
app.put("/todos/:id", requireAuth, async (req, res) => {
  console.log('updating a todo item by id')
  const id = parseInt(req.params.id, 10);
  const { title } = req.body;

  if (!title) {
    return res.status(400).send("title is required");
  }

  const updatedItem = await prisma.todoItem.update({
    where: {
      id,
    },
    data: {
      title,
    },
  });
  res.json(updatedItem);
});

// get Profile information of authenticated user
app.get("/me", requireAuth, async (req, res) => {
  console.log('fetching profile information of authenticated user')
  // console.log(`Authorization Header: ${req.headers.authorization}`);
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
    include: {
      todos: true,
      comments: true,
      favorites: {
      include: {
        todoItem: true
      }
    }
    }
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// verify user status, if not registered in our database we will create it
app.post("/verify-user", requireAuth, async (req, res) => {
  console.log('verifying user status')
  console.log(`Authorization Header: ${req.headers.authorization}`);
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  let user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  // If user doesn't exist with that auth0Id, try finding by email
  if (!user) {
    user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

// creates a comment for a todo item
app.post("/todos/:id/comments", requireAuth, async (req, res) => {
  console.log('creating a comment for a todo item');
  const auth0Id = req.auth.payload.sub;
  const { text } = req.body;
  const todoItemId = req.params.id;

  if (!text) {
    return res.status(400).send("text is required");
  }

  const newComment = await prisma.comment.create({
    data: {
      text,
      author: { connect: { auth0Id } },
      todoItem: { connect: { id: parseInt(todoItemId, 10) } }
    },
  });

  res.status(201).json(newComment);
});

// favorites a todo item
app.post("/todos/:id/favorites", requireAuth, async (req, res) => {
  console.log('favoriting a todo item');
  console.log(`Authorization Header: ${req.headers.authorization}`);
  const auth0Id = req.auth.payload.sub;
  const todoItemId = req.params.id;

  const newFavorite = await prisma.favorite.create({
    data: {
      user: { connect: { auth0Id } },
      todoItem: { connect: { id: parseInt(todoItemId, 10) } }
    },
  });

  res.status(201).json(newFavorite);
});

// fetches comments for a todo item
app.get("/todos/:id/comments", async (req, res) => {
  console.log('fetching comments for a todo item');
  const todoItemId = req.params.id;
  
  const comments = await prisma.comment.findMany({
    where: {
      todoItemId: parseInt(todoItemId, 10)
    },
  });

  res.json(comments);
});

// fetches favorites for a todo item
app.get("/todos/:id/favorites", async (req, res) => {
  const todoItemId = req.params.id;
  
  const favorites = await prisma.favorite.findMany({
    where: {
      todoItemId: parseInt(todoItemId, 10)
    },
  });

  res.json(favorites);
});

// fetch recent artwork
// app.get("/todos/recent", async (req, res) => {
//   console.log('fetching recent artwork')
//   const recentTodo = await prisma.todoItem.findFirst({
//     orderBy: {
//       createdAt: 'desc',
//     },
//   });
//   console.log(recentTodo.title)
//   res.json(recentTodo);
// });

// fetch recent favorite
app.get("/favorites/recent", async (req, res) => {
  console.log('fetching recent favorite')
  const recentFavorite = await prisma.favorite.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      todoItem: true,
    },
  });
  // console.log(recentFavorite.todoItem.title)
  res.json(recentFavorite);
});

// fetch recent comment
app.get("/comments/recent", async (req, res) => {
  console.log('fetching recent comment')
  const recentComment = await prisma.comment.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      todoItem: true,
    },
  });
  console.log(recentComment.todoItem.title)
  res.json(recentComment);
});

// Fetch recent favorite by user
app.get("/users/:auth0Id/favorites/recent", requireAuth, async (req, res) => {
  console.log('fetching recent favorite by user')
  const auth0Id = req.params.auth0Id;
  const user = await prisma.user.findUnique({ where: { auth0Id } });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const recentUserFavorite = await prisma.favorite.findFirst({
    where: {
      userId: user.id,  // 使用用户的 id, 而不是 auth0Id
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      todoItem: true,
    },
  });
  
  res.json(recentUserFavorite);
});

// Fetch recent comment by user
app.get("/users/:auth0Id/comments/recent", requireAuth, async (req, res) => {
  console.log('fetching recent comment by user')
  const auth0Id = req.params.auth0Id;
  const user = await prisma.user.findUnique({ where: { auth0Id } });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const recentUserComment = await prisma.comment.findFirst({
    where: {
      authorId: user.id,  // 使用用户的 id, 而不是 auth0Id
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      todoItem: true,
    },
  });

  res.json(recentUserComment);
});

app.post('/changeName', requireAuth, async (req, res) => {
  const { auth0Id, name } = req.body;
  const user = await prisma.user.findUnique({ where: { auth0Id } });

  if (!auth0Id || !name) {
    return res.status(400).send("auth0Id and name are required");
  }

  if (!user) {
    return res.status(404).send("User not found");
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: name }
    });
    res.status(200).json({status: 'Name changed successfully'});
  } catch (error) {
    res.status(500).json({status: 'Error changing name', error});
  }
});

app.post('/changePlan', requireAuth, async (req, res) => {
  const { auth0Id, plan } = req.body;
  const user = await prisma.user.findUnique({ where: { auth0Id } });

  if (!user) {
    return res.status(404).send("User not found");
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { currentPlan: plan }
    });
    res.status(200).json({status: 'Plan changed successfully'});
  } catch (error) {
    res.status(500).json({status: 'Error changing plan', error});
  }
});

// app.listen(8000, () => {
//   console.log("Server running on http://localhost:8000 🎉 🚀");
// });

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});
