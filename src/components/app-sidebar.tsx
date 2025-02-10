"use client"
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import { useAuth } from "@/app/feed/layout";
import { Button } from "./ui/button";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Aurora Posts",
      url: "/feed",
    },
    {
      title: "Forecasts & Live",
      url: "#",
      items: [
        {
          title: "Aurora Statistics",
          url: "/feed/statistics",
        },
        {
          title: "Solar Activity",
          url: "/feed/solar-activity",
        },
        {
          title: "Aurora Live",
          url: "/feed/aurora-live",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {logout} = useAuth();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <p className="text-2xl font-black px-2 py-[14px]">Main Menu</p>
      </SidebarHeader>
      <Separator/>
      <SidebarContent className="bg-transparent">
        <SidebarGroup className="bg-transparent">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="font-medium">
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={item.url}>{item.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button onClick={logout}>Logout</Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
