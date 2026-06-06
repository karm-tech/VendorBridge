import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authenticate } from "../middleware/auth.js"

const router = Router()

router.use(authenticate)

router.get("/", async (req, res, next) => {
  try {
    const { type } = req.query
    const where = {}
    if (type && type !== "all") where.type = type
    const activities = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: { select: { firstName: true, lastName: true } } },
    })
    res.json({ activities })
  } catch (err) {
    next(err)
  }
})

export default router
