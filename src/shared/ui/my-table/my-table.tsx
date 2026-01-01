"use client"

import { LoaderCircleIcon } from "lucide-react"
import { useEffect, useRef } from "react"
import { cn } from "shared/lib"
import { ComponentProps } from "shared/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table"
import { MyPagination, MyPaginationProps } from "./my-pagination"

export interface IMyTableColumn<T> {
  header: string
  cell: (item: T) => React.ReactNode
  headerClassName?: string
  cellClassName?: string
}

interface MyTableProps<T> extends ComponentProps {
  className?: string

  loading?: boolean
  data: T[]
  columns: IMyTableColumn<T>[]
  showPagination?: boolean
  error?: {
    message?: React.ReactNode
    hide?: boolean
  }

  pagination?: MyPaginationProps
  onClickRow?: (item: T) => void
}

export const MyTable = <T,>(props: MyTableProps<T>) => {
  const tableRef = useRef<HTMLTableElement>(null)

  const scrollToTop = () => {
    tableRef.current?.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }

  useEffect(() => {
    scrollToTop()
  }, [props.data])

  return (
    <div className="w-full space-y-4">
      <div className={cn("scrollbar-none w-full overflow-y-auto rounded-md border", props.className)}>
        <Table ref={tableRef}>
          <TableHeader className="bg-secondary/70 sticky top-0 z-10 backdrop-blur-xs">
            <TableRow className="">
              {props.columns.map((column, index) => (
                <TableHead key={index} className={cn("h-11", column.headerClassName)}>
                  <div className={cn("flex h-full cursor-pointer items-center justify-between gap-2 select-none")}>
                    {column.header}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-background">
            {!!props.data.length ? (
              props.data.map((item, index) => (
                <TableRow key={index} className="" onClick={() => props.onClickRow?.(item)}>
                  {props.columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={cn("last:py-0", column.cellClassName)}>
                      {column.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <>
                {props.loading ? (
                  <TableRow>
                    <TableCell align="center" colSpan={props.columns.length} className="h-24">
                      <div className="flex items-center justify-center gap-2">
                        <LoaderCircleIcon className="text-primary animate-spin" size={24} aria-hidden="true" />
                        <span className="font-medium">Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={props.columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      {props.showPagination && <MyPagination {...props.pagination} />}
    </div>
  )
}
