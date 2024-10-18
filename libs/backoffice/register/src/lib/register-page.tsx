'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Button,
  Form,
  FormField,
  FormMessage,
  Input,
  Label,
  useToast,
} from '@/shared/components/base';

import { RegisterBody, registerMutation } from './mutations/register.mutation';
import { registerSchema, RegisterSchemaType } from './schema/register.schema';

export function BackofficeRegister() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterBody) => {
    const mutation = await registerMutation(values);
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
        title: 'Success Register',
        description: (
          <span className="capitalize">Success Register, please login</span>
        ),
        type: 'foreground',
      });
    }
  };
  return (
    <div className="">
      <h1 className="text-center text-2xl font-bold">Register</h1>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" {...field} />
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="password">Email</Label>
                  <Input
                    id="password"
                    showPassword={isShowPassword}
                    setShowPassword={setIsShowPassword}
                    {...field}
                  />
                  <FormMessage />
                </div>
              )}
            />
            <Button type="submit" className="w-full">
              Register
            </Button>
            <p className="flex justify-end">
              Already have account?
              <Link href="/login" className="ml-1 text-blue-700">
                Login
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default BackofficeRegister;
