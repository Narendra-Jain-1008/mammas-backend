import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createUsersWorkflow } from "@medusajs/medusa/core-flows"

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

  const { result } = await createUsersWorkflow(req.scope).run({
    input: {
      users: [{ email, first_name, last_name }],
      authIdentityId,
    },
  })

  res.json({ 
    user: result[0], 
    message: "Admin user created successfully" 
  })
}
