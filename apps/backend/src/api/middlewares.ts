import { defineMiddlewares, authenticate } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/create-admin",
      method: ["POST"],
      middlewares: [
        authenticate("user", ["bearer"], {
          allowUnregistered: true,
        }),
      ],
    },
  ],
})
