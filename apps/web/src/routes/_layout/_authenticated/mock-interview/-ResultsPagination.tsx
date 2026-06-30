import { useTranslation } from "react-i18next"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type ResultsPaginationProps = {
  limit: number
  totalPage: number
  total: number
  currentPage: number
  onPageChange: (page: number) => void
}

export const ResultsPagination = ({ currentPage, limit, total, totalPage, onPageChange }: ResultsPaginationProps) => {
  const { t } = useTranslation()
  const pages = getPaginationList(currentPage, totalPage)
  const showStart = (currentPage - 1) * limit + 1
  const showEnd = Math.min(currentPage * limit, total)

  return (
    <div className="flex flex-row items-center justify-center md:justify-between">
      <div className="hidden w-full md:block">
        <p className="text-muted-foreground text-xs">
          {t("mockInterview.source.showing", { from: showStart, to: showEnd, total })}
        </p>
      </div>
      <Pagination className="w-fit">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              text=""
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) onPageChange(currentPage - 1)
              }}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>
          {pages.map((p, i) =>
            p === "..." ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === currentPage}
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(p)
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              text=""
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPage) onPageChange(currentPage + 1)
              }}
              aria-disabled={currentPage === totalPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

const getPaginationList = (currentPage: number, totalPage: number): (number | "...")[] => {
  if (totalPage <= 5) return Array.from({ length: totalPage }, (_, i) => i + 1)

  const start = Math.max(1, Math.min(currentPage - 1, totalPage - 2))
  const end = start + 2

  const pages: (number | "...")[] = []
  if (start > 1) pages.push(1)
  if (start > 2) pages.push("...")
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPage - 1) pages.push("...")
  if (end < totalPage) pages.push(totalPage)

  return pages
}
