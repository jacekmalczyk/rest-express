import {Prisma, PrismaClient} from "@prisma/client";
import {Router} from "express";

export const prisma = new PrismaClient();
export const router = Router();

router.post(`/login`, async (req, res) => {
  const {email, password} = req.body

  const result = await prisma.user.create({
    data: {
      email,
    },
  })
  res.json(result)
})

router.post(`/signup`, async (req, res) => {
  const {firstname, lastname, email, posts} = req.body

  const postData = posts?.map((post: Prisma.PostCreateInput) => {
    return {title: post?.title, content: post?.content}
  })

  const result = await prisma.user.create({
    data: {
      firstname,
      lastname,
      email,
      posts: {
        create: postData,
      },
    },
  })
  res.json(result)
})

router.post(`/post`, async (req, res) => {
  const {title, content, authorEmail} = req.body
  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: {connect: {email: authorEmail}},
    },
  })
  res.json(result)
})

router.put('/post/:id/views', async (req, res) => {
  const {id} = req.params

  try {
    const post = await prisma.post.update({
      where: {id: Number(id)},
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    res.json(post)
  } catch (error) {
    res.json({error: `Post with ID ${id} does not exist in the database`})
  }
})

router.put('/publish/:id', async (req, res) => {
  const {id} = req.params

  try {
    const postData = await prisma.post.findUnique({
      where: {id: Number(id)},
      select: {
        published: true,
      },
    })

    const updatedPost = await prisma.post.update({
      where: {id: Number(id) || undefined},
      data: {published: !postData?.published},
    })
    res.json(updatedPost)
  } catch (error) {
    res.json({error: `Post with ID ${id} does not exist in the database`})
  }
})

router.delete(`/post/:id`, async (req, res) => {
  const {id} = req.params
  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(post)
})

router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

router.get('/users/:id', async (req, res) => {
  const {id} = req.params

  const user = await prisma.user
    .findUnique({
      where: {
        id: Number(id),
      },
    })

  res.json(user)
})

router.post('/users', async (req, res) => {
  try {
    const result = await prisma.user
      .create({
        data: {
          email: req.body.email,
          firstname: req.body.firstname,
          lastname: req.body.lastname
        }
      })
    res.json(result)
  } catch (e) {
    res.status(400);
    res.json({error: `Could not create User`})
  }
})

router.put('/users/:id', async (req, res) => {
  const {id} = req.params
  try {
    const user = await prisma.user
      .update({
        where: {
          id: Number(id),
        },
        data: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email
        }
      })
    res.json(user)
  } catch (e) {
    res.status(400);
    res.json({error: `Could not update User with ID ${id}`})
  }
})

router.delete('/users/:id', async (req, res) => {
  const {id} = req.params
  try {
    const user = await prisma.user
      .delete({
        where: {
          id: Number(id),
        },
      })
    res.json(user)
  } catch (e) {
    res.status(400);
    res.json({error: `Could not delete User with ID ${id}`})
  }
})


export default router;
