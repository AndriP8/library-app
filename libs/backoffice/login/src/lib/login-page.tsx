'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { useTokenContext } from '@/shared/utils';

import { LoginBody, loginMutation } from './mutations/login.mutation';
import { loginSchema, LoginSchemaType } from './schema/login.schema';

export function BackofficeLogin() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { setToken } = useTokenContext();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginBody) => {
    const mutation = await loginMutation(values);
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
    if ('token' in mutation) {
      setToken(mutation.token);
      toast({
        title: 'Login Success',
        description: '',
        type: 'foreground',
      });
      router.push('/backoffice');
    }
  };
  return (
    <div className="">
      <h1 className="text-center text-2xl font-bold">Login</h1>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              Login
            </Button>
            <p className="flex justify-end">
              Don't have an account yet?
              <Link href="/login" className="ml-1 text-blue-700">
                Register
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default BackofficeLogin;
