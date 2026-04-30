import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createUserWorkflow } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { email, first_name, last_name } = req.body as {
    email: string
    first_name: string
    last_name: string
  }

  const authIdentityId = req.auth_context.auth_identity_id

  const { result: user } = await createUserWorkflow(req.scope).run({
    input: {
      user: { email, first_name, last_name },
      authIdentityId,
    },
  })

  res.json({ user, message: "Admin user created successfully" })
}
