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
  Textarea,
  toast,
} from '@/shared/components/base';
import { useTokenContext } from '@/shared/utils';

import { addAuthorMutation } from '../mutations/add-author.mutation';
import { AddAuthorSchema, addAuthorSchema } from './schema/add-author.schema';

export function BackofficeAddAuthors() {
  const form = useForm<AddAuthorSchema>({
    resolver: zodResolver(addAuthorSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      bio: '',
      avatarUrl: '',
      totalPublishedBook: 0,
    },
  });
  const { token } = useTokenContext();
  const router = useRouter();

  const onSubmit = async (value: AddAuthorSchema) => {
    const mutation = await addAuthorMutation(token, value);

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
      router.push('/backoffice/author');
      router.refresh();
    }
  };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add Author</h1>
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
            <Button>Add Author</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default BackofficeAddAuthors;
