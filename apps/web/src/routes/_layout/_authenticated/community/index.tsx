import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/_authenticated/community/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-muted-foreground mb-4 text-base font-bold tracking-widest uppercase md:text-lg">
            Tính năng này đang trong giai đoạn phát triển
          </h1>
        </div>
      </section>
    </div>
  )
}
