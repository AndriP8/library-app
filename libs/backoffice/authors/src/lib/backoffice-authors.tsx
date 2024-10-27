'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useEffect } from 'react';
import { z } from 'zod';

import { Button, DataTable } from '@/shared/components/base';
import { authorsSchema } from '@/shared/schema';
import { formatDate, useTableInfo, useTokenContext } from '@/shared/utils';

import { getAuthors } from './data-fetching/get-authors';

type Author = z.infer<typeof authorsSchema.read.response>['data'][number];

export function BackofficeAuthors() {
  const {
    data,
    pageCount,
    pagination,
    setPagination,
    tableQuery,
    setPageData,
  } = useTableInfo<Author>();
  const { token } = useTokenContext();

  const columns: ColumnDef<Author, 'firstName'>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      size: 200,
    },
    {
      accessorKey: 'totalPublishedBook',
      header: 'Total Published Book',
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
            <Link href={`/backoffice/author/${row.original.id}`}>
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
    getAuthors(token, query).then((res) =>
      setPageData(res.data, res.pagination.totalPages),
    );
  }, [tableQuery, setPageData, token]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Authors</h1>
      <div className="flex justify-end">
        <Link href="/backoffice/author/add">
          <Button>Add Author</Button>
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

export default BackofficeAuthors;
