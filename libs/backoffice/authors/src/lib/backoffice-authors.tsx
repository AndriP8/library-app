'use client';

import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';

import { DataTable } from '@/shared/components/base';
import { authorsSchema } from '@/shared/schema';
import { formatDate } from '@/shared/utils';

type Author = z.infer<typeof authorsSchema.read.response>['data'][number];

const data: Author[] = [
  {
    id: '53068017-3f72-486f-b0c9-54525045a995',
    firstName: 'Kiley',
    lastName: 'Reichert',
    bio: 'In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.',
    totalPublishedBook: 52,
    createdAt: '2024-01-13 21:33:30',
    updatedAt: '2024-02-05 05:01:24',
    avatarUrl: 'http://dummyimage.com/140x100.png/dddddd/000000',
  },
  {
    id: '8580dc9b-9b2a-40a7-a476-ad72db0f147c',
    firstName: 'Ingaborg',
    lastName: 'Pach',
    bio: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.',
    totalPublishedBook: 31,
    createdAt: '2024-10-09 04:27:37',
    updatedAt: '2024-01-20 07:18:32',
    avatarUrl: 'http://dummyimage.com/246x100.png/dddddd/000000',
  },
  {
    id: 'd7afacd9-7a2c-48be-aeb2-5972ee704c60',
    firstName: 'Albertina',
    lastName: 'Spring',
    bio: 'Phasellus in felis. Donec semper sapien a libero. Nam dui.\n\nProin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.',
    totalPublishedBook: 32,
    createdAt: '2023-11-11 14:10:37',
    updatedAt: '2024-09-11 01:49:38',
    avatarUrl: 'http://dummyimage.com/118x100.png/ff4444/ffffff',
  },
  {
    id: 'f849546e-0b87-4ec4-a0de-10a454e34f8c',
    firstName: 'Eveleen',
    lastName: 'Rames',
    bio: 'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.\n\nFusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.',
    totalPublishedBook: 19,
    createdAt: '2024-07-26 09:55:03',
    updatedAt: '2023-11-22 07:38:18',
    avatarUrl: 'http://dummyimage.com/205x100.png/5fa2dd/ffffff',
  },
  {
    id: 'e137a2ea-b706-4977-93cc-034bc62e3744',
    firstName: 'Norry',
    lastName: 'Bruhke',
    bio: 'Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.\n\nInteger ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.',
    totalPublishedBook: 58,
    createdAt: '2024-04-15 19:32:23',
    updatedAt: '2024-10-16 09:53:26',
    avatarUrl: 'http://dummyimage.com/131x100.png/cc0000/ffffff',
  },
];

export function BackofficeAuthors() {
  const columns: ColumnDef<Author, 'firstName'>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
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
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Authors</h1>
      <DataTable
        columns={columns}
        data={data}
        // TODO: update pagination when integration
        pagination={{ pageSize: 1, pageIndex: 1 }}
        pageCount={1}
      />
    </div>
  );
}

export default BackofficeAuthors;
