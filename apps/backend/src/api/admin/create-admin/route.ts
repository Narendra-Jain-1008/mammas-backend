import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createUsersWorkflow } from "@medusajs/medusa/core-flows"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

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
    },
  })

  const createdUser = result[0]

  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  await remoteLink.create({
    [Modules.AUTH]: {
      auth_identity_id: authIdentityId,
    },
    [Modules.USER]: {
      user_id: createdUser.id,
    },
  })

  res.json({
    user: createdUser,
    message: "Admin user created successfully"
  })
}
