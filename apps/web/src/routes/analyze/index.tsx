import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/analyze/")({
  component: RouteComponent,
})

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  return <div>Hello "/analyze/"!</div>
}
