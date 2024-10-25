'use client';

import { ColumnDef } from '@tanstack/react-table';
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
        <Button>Add Author</Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        // TODO: update pagination when integration
        pagination={pagination}
        onPaginationChange={setPagination}
        pageCount={pageCount}
      />
    </div>
  );
}

export default BackofficeAuthors;
