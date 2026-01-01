"use client"

import { useRouter } from "i18n/navigation"
import { warehouseApi } from "shared/api/init"
import { formatDate } from "shared/lib"
import { IMyTableColumn, MyTable } from "shared/ui"

const Page = () => {
  const router = useRouter()
  const users = warehouseApi.admin.useGetAllUsers({
    page: 0,
    size: 10,
  })

  const columns: Array<IMyTableColumn<any>> = [
    {
      header: "User",
      cell: (item) => (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col">
            <span className="font-medium">
              {item.firstName} {item.lastName}
            </span>
            <div>
              <span className="text-muted-foreground">{item.email}</span> {item.username}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Company",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="max-w-44 truncate font-medium">{item.company}</span>
          <span className="text-muted-foreground max-w-44 truncate">{item.companyAddress}</span>
        </div>
      ),
    },
    {
      header: "Registration Date",
      cell: (item) => formatDate(item.createdAt),
    },
  ]

  // const onClickRow = (row: AppUsersUserResponse) => {
  //   router.push(pages.user.slug(row.id).href)
  // }

  // const onChangePagination = (pagination: { page?: number; limit?: number }) => {
  //   const req = PropertiesListRequestToUrl({
  //     ...props.request,
  //     ...pagination,
  //   })
  //   router.replace(`${pathname}?${req}`, {
  //     scroll: false,
  //   })
  // }

  return (
    <MyTable
      data={users.data?.content || []}
      columns={columns}
      loading={users.isLoading}
      // onClickRow={onClickRow}
      pagination={{
        totalPages: users.data?.totalPages,
        currentPage: users.data?.pageable?.pageNumber,
        pageSize: users.data?.size,
        // onChange: onChangePagination,
      }}
    />
  )
}

export default Page
