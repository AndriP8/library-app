'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

import { addBookCategoryMutation } from '../mutations/add-book-category.mutation';
import {
  AddBookCategorySchema,
  addBookCategorySchema,
} from './schema/add-book-category.schema';

export function BackofficeAddBookCategory() {
  const form = useForm<AddBookCategorySchema>({
    resolver: zodResolver(addBookCategorySchema),
    defaultValues: {
      name: '',
    },
  });
  const { token } = useTokenContext();
  const router = useRouter();

  const onSubmit = async (value: AddBookCategorySchema) => {
    const mutation = await addBookCategoryMutation(token, value);

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
        title: 'Add Author Success',
        description: '',
        type: 'foreground',
      });
      router.push('/backoffice/book-category');
      router.refresh();
    }
  };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add Author</h1>
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
            <Link href="/backoffice/authors">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button>Add Book Category</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
