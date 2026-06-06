import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authenticate } from "../middleware/auth.js"

const router = Router()

router.use(authenticate)

router.get("/", async (req, res, next) => {
  try {
    const emails = await prisma.emailLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    })
    res.json({ emails })
  } catch (err) {
    next(err)
  }
})

router.get("/:id", async (req, res, next) => {
  try {
    const email = await prisma.emailLog.findUnique({ where: { id: req.params.id } })
    if (!email) return res.status(404).json({ error: "Email not found" })
    res.json({ email })
  } catch (err) {
    next(err)
  }
})

export default router
