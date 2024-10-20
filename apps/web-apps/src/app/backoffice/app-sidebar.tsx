import { BookText, BookUser, Home, SquareLibrary } from 'lucide-react';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/base';

// Sidebar items
const sidebarItems = [
  {
    title: 'Dashboard',
    url: '/backoffice',
    icon: Home,
  },
  {
    title: 'Book',
    url: '/backoffice/book',
    icon: BookText,
  },
  {
    title: 'Book Category',
    url: '/backoffice/book-category',
    icon: SquareLibrary,
  },
  {
    title: 'Author',
    url: '/backoffice/author',
    icon: BookUser,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Book Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
