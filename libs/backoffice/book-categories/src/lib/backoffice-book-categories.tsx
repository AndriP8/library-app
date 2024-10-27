'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useEffect } from 'react';
import { z } from 'zod';

import { Button, DataTable } from '@/shared/components/base';
import { bookCategoriesSchema } from '@/shared/schema';
import { formatDate, useTableInfo, useTokenContext } from '@/shared/utils';

import { getBookCategories } from './data-fetching/get-book-categories';

type BookCategory = z.infer<
  typeof bookCategoriesSchema.read.response
>['data'][number];

export function BackofficeBookCategories() {
  const {
    data,
    pageCount,
    pagination,
    setPagination,
    tableQuery,
    setPageData,
  } = useTableInfo<BookCategory>();
  const { token } = useTokenContext();

  const columns: ColumnDef<BookCategory, 'firstName'>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 200,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      cell: ({ row }) => formatDate(new Date(row.original.updatedAt)),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Link href={`/backoffice/book-category/${row.original.id}`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <Button variant="destructive">Delete</Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (!token) return;
    const query = tableQuery();
    getBookCategories(token, query).then((res) =>
      setPageData(res.data, res.pagination.totalPages),
    );
  }, [tableQuery, setPageData, token]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Book Categories</h1>
      <div className="flex justify-end">
        <Link href="/backoffice/book-category/add">
          <Button>Add Book Category</Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        onPaginationChange={setPagination}
        pageCount={pageCount}
      />
    </div>
  );
}
