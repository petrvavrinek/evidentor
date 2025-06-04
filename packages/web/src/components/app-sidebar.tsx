"use client";

import {
  Home,
  Users,
  FolderKanban,
  Clock,
  FileText,
  BarChart3,
  Calendar,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import config from "@/config/app";

import { TypographyH1 } from "./ui/typography";
import { NavUser } from "./nav-user";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const currentPathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/app", icon: Home, id: "dashboard" },
    { name: "Clients", href: "/app/clients", icon: Users, id: "clients" },
    {
      name: "Projects",
      href: "/app/projects",
      icon: FolderKanban,
      id: "projects",
    },
    {
      name: "Time Tracker",
      href: "/app/time-tracker",
      icon: Clock,
      id: "time-tracker",
    },
    { name: "Invoices", href: "/app/invoices", icon: FileText, id: "invoices" },
    { name: "Reports", href: "/app/reports", icon: BarChart3, id: "reports" },
    { name: "Calendar", href: "/app#", icon: Calendar, id: "calendar" },
    { name: "Settings", href: "/app/settings", icon: Settings, id: "settings" },
  ];

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader>
        <TypographyH1 className="my-4 flex justify-center items-center">
          <Clock className="mr-2" size={32}/>
          <span>{config.AppName}</span>
        </TypographyH1>
      </SidebarHeader>
      <SidebarSeparator className="w-auto" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            {navigation.map((e) => (
              <Link href={e.href} key={e.id}>
                <SidebarMenuButton
                  className="cursor-pointer"
                  isActive={currentPathname == e.href}
                >
                  <e.icon />
                  <span>{e.name}</span>
                </SidebarMenuButton>
              </Link>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            avatar: "",
            email: "test@test.cz",
            name: "Test test",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
