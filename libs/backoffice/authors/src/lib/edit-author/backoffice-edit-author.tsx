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
  Textarea,
  toast,
} from '@/shared/components/base';
import { useTokenContext } from '@/shared/utils';

import {
  AuthorResponse,
  getAuthorDetail,
} from '../data-fetching/get-author-detail';
import { editAuthorMutation } from './mutations/edit-author.mutation';
import { AddAuthorSchema, editAuthorSchema } from './schema/edit-author.schema';

export function BackofficeEditAuthor() {
  const [author, setAuthor] = useState<AuthorResponse['data'] | null>(null);

  const form = useForm<AddAuthorSchema>({
    resolver: zodResolver(editAuthorSchema),
    defaultValues: {
      id: '',
      firstName: '',
      lastName: '',
      bio: '',
      avatarUrl: '',
      totalPublishedBook: 0,
    },
    values: {
      id: author?.id || '',
      firstName: author?.firstName || '',
      lastName: author?.lastName || '',
      bio: author?.bio || '',
      avatarUrl: author?.avatarUrl || '',
      totalPublishedBook: author?.totalPublishedBook || 0,
    },
  });
  const { token } = useTokenContext();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const onSubmit = async (value: AddAuthorSchema) => {
    const mutation = await editAuthorMutation(token, value);

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
        title: 'Edit Author Success',
        description: '',
        type: 'foreground',
      });
      router.push('/backoffice/author');
      router.refresh();
    }
  };

  useEffect(() => {
    if (params.id && token) {
      getAuthorDetail(token, params.id).then((res) => setAuthor(res.data));
    }
  }, [params.id, token]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Author</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name<span className="text-red-500">*</span>
                </Label>
                <Input id="firstName" {...field} />
                <FormMessage />
              </div>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...field} />
                <FormMessage />
              </div>
            )}
          />
          <FormField
            name="bio"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="bio">
                  Bio<span className="text-red-500">*</span>
                </Label>
                <Textarea id="bio" {...field} />
                <FormMessage />
              </div>
            )}
          />
          <FormField
            name="avatarUrl"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">
                  Avatar URL<span className="text-red-500">*</span>
                </Label>
                <Input id="avatarUrl" {...field} />
                <FormMessage />
              </div>
            )}
          />
          <FormField
            name="totalPublishedBook"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="totalPublishedBook">
                  Total Published Book<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="totalPublishedBook"
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                <FormMessage />
              </div>
            )}
          />
          <div className="flex justify-end gap-x-4">
            <Link href="/backoffice/authors">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button>Edit Author</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
