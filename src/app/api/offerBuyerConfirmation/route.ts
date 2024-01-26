import { getAuthSession } from "@/src/lib/auth/auth-options"
import { db } from "@/src/server/db"
import { offers } from "@/src/server/db/schema"
import { eq } from "drizzle-orm"

export async function PUT(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const offerId = await req.json()

    const updateIsConfirmed = await db
      .update(offers)
      .set({ isCountered: false, isConfirmed: true })
      .where(eq(offers.id, offerId))

    return new Response(JSON.stringify(updateIsConfirmed), { status: 200 })
  } catch (error) {
    console.error("Update confirmation status error:", error)
    return new Response("Could not update confirmation status.", {
      status: 500,
    })
  }
}
