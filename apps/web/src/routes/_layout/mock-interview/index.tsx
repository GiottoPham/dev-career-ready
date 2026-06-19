import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/mock-interview/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/mock-interview/"!</div>
}
