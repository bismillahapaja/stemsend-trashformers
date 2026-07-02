import { prisma } from '@/lib/prisma'

/** Maximum number of predictions to retain. */
export const HISTORY_CAPACITY = 30

/**
 * Trims the predictions table to the latest HISTORY_CAPACITY rows.
 * Feedbacks for removed predictions are cascade-deleted automatically.
 * Returns the number of rows deleted.
 */
export async function trimHistoryToCapacity(): Promise<number> {
  const keep = await prisma.prediction.findMany({
    orderBy: { createdAt: 'desc' },
    take: HISTORY_CAPACITY,
    select: { id: true },
  })

  if (keep.length < HISTORY_CAPACITY) return 0

  const keepIds = keep.map((p) => p.id)
  const result = await prisma.prediction.deleteMany({
    where: { id: { notIn: keepIds } },
  })
  return result.count
}
