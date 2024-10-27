'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Button,
  Form,
  FormField,
  FormMessage,
  Input,
  Label,
  toast,
} from '@/shared/components/base';
import { useTokenContext } from '@/shared/utils';

import {
  BookCategoryResponse,
  getBookCategoryDetail,
} from '../data-fetching/get-book-category-detail';
import { editBookCategoryMutation } from '../mutations/edit-book-category.mutation';
import {
  EditBookCategorySchema,
  editBookCategorySchema,
} from './schema/edit-book-category.schema';

export function BackofficeEditBookCategory() {
  const [bookCategory, setBookCategory] = useState<
    BookCategoryResponse['data'] | null
  >(null);

  const form = useForm<EditBookCategorySchema>({
    resolver: zodResolver(editBookCategorySchema),
    defaultValues: {
      id: '',
      name: '',
    },
    values: {
      id: bookCategory?.id || '',
      name: bookCategory?.name || '',
    },
  });
  const { token } = useTokenContext();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const onSubmit = async (value: EditBookCategorySchema) => {
    const mutation = await editBookCategoryMutation(token, value);

    if ('reasons' in mutation) {
      const reasons = JSON.parse(mutation.reasons);
      let description = '';
      for (const key in reasons) {
        description = `${key}: ${reasons[key][0]}`;
      }
      toast({
        title: mutation.message,
        description: <span className="capitalize">{description}</span>,
        type: 'foreground',
      });
    }
    if ('data' in mutation) {
      toast({
        title: 'Edit Book Category Success',
        description: '',
        type: 'foreground',
      });
      router.push('/backoffice/book-category');
      router.refresh();
    }
  };

  useEffect(() => {
    if (params.id && token) {
      getBookCategoryDetail(token, params.id).then((res) =>
        setBookCategory(res.data),
      );
    }
  }, [params.id, token]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Book Category</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name<span className="text-red-500">*</span>
                </Label>
                <Input id="name" {...field} />
                <FormMessage />
              </div>
            )}
          />
          <div className="flex justify-end gap-x-4">
            <Link href="/backoffice/book-category">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button>Edit Book Category</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
