import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { tablePaginationConfig } from "shared/config"
import { usePagination } from "shared/lib"
import {
  Button,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui"

export interface MyPaginationProps {
  totalPages?: number
  currentPage?: number
  pageSize?: number
  isLoading?: boolean
  onChange?: (pagination: Partial<{ page?: number; limit?: number }>) => void
}

export const MyPagination = (props: MyPaginationProps) => {
  const onChangePageSize = (size: number) => {
    props.onChange?.({ limit: size, page: 1 })
  }

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: props.currentPage || 1,
    totalPages: props.totalPages || 1,
    paginationItemsToDisplay: 5,
  })

  const onClickPrevious = () => {
    if (props.currentPage && props.currentPage > 1) {
      props.onChange?.({ page: props.currentPage - 1 })
    }
  }

  const onClickNext = () => {
    if (props.currentPage && props.currentPage < (props.totalPages || 1)) {
      props.onChange?.({ page: props.currentPage + 1 })
    }
  }

  const onChangePage = (page: number) => {
    props.onChange?.({ page })
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-md max-sm:flex-col">
      <p className="text-muted-foreground flex-1 text-sm whitespace-nowrap" aria-live="polite">
        Page <span className="text-foreground">{props?.currentPage}</span> of{" "}
        <span className="text-foreground">{props?.totalPages}</span>
      </p>

      <div className="grow">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={() => onClickPrevious()}
                disabled={!props.currentPage || props.currentPage <= 1}
                aria-label="Go to previous page"
              >
                <ChevronLeftIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>

            {showLeftEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {pages.map((page) => {
              const isActive = page === props.currentPage
              return (
                <PaginationItem key={page}>
                  <Button
                    size="icon"
                    variant={`${isActive ? "outline" : "ghost"}`}
                    onClick={() => onChangePage(page)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {page}
                  </Button>
                </PaginationItem>
              )
            })}

            {showRightEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={() => onClickNext()}
                disabled={!props.currentPage || props.currentPage >= (props.totalPages || 1)}
                aria-label="Go to next page"
              >
                <ChevronRightIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className="flex flex-1 justify-end">
        <Select
          value={props.pageSize?.toString() || tablePaginationConfig.defaultRowsPerPage.toString()}
          onValueChange={(value) => {
            onChangePageSize(Number(value))
          }}
          aria-label="Results per page"
        >
          <SelectTrigger id="results-per-page" className="w-fit whitespace-nowrap">
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent>
            {tablePaginationConfig.rowsPerPageOptions.map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
