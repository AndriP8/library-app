import '@/shared/styles';

import { Toaster } from '@/shared/components/base';
import { TokenContextProvider } from '@/shared/utils';

export const metadata = {
  title: 'Welcome to backoffice',
  description: 'Generated by create-nx-workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TokenContextProvider>
          {children}
          <Toaster />
        </TokenContextProvider>
      </body>
    </html>
  );
}
