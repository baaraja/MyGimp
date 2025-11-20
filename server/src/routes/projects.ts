import { Router, Request, Response } from 'express'
import prisma from '../prisma'
import { authRequired } from '../middleware/auth'

const router = Router()

router.post('/', authRequired, async (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'Missing title' })
  const project = await prisma.project.create({ data: { title, ownerId: req.userId! } })
  res.json(project)
})

router.get('/', authRequired, async (req, res) => {
  const projects = await prisma.project.findMany({ where: { ownerId: req.userId } })
  res.json(projects)
})

router.delete('/:id', authRequired, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (!id) return res.status(400).json({ error: 'Invalid id' })
  const project = await prisma.project.findUnique({ where: { id } })
  if (!project || project.ownerId !== req.userId) return res.status(404).json({ error: 'Not found' })
  await prisma.project.delete({ where: { id } })
  res.json({ success: true })
})

export default router
