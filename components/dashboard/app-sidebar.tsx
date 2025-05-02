"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { NavDocuments } from "@/components/dashboard/nav-documents";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { fetchBusinessInsights } from "@/lib/actions/business.actions";

const data = {
  navMain: [
    { title: "Dashboard", url: "#", icon: LayoutDashboardIcon },
    { title: "Lifecycle", url: "#", icon: ListIcon },
    { title: "Analytics", url: "#", icon: BarChartIcon },
    { title: "Projects", url: "#", icon: FolderIcon },
    { title: "Team", url: "#", icon: UsersIcon },
  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: SettingsIcon },
    { title: "Get Help", url: "#", icon: HelpCircleIcon },
    { title: "Search", url: "#", icon: SearchIcon },
  ],
  documents: [
    { name: "Data Library", url: "#", icon: DatabaseIcon },
    { name: "Reports", url: "#", icon: ClipboardListIcon },
    { name: "Word Assistant", url: "#", icon: FileIcon },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [businessName, setBusinessName] = React.useState("Loading...");
  const [businessEmail, setBusinessEmail] = React.useState("");

  React.useEffect(() => {
    const loadBusiness = async () => {
      try {
        const data = await fetchBusinessInsights();
        setBusinessName(data.companyName || "Your Business");
        setBusinessEmail(data.businessEmail || "");
      } catch (error) {
        console.error("Failed to fetch business info", error);
        setBusinessName("Unknown Business");
      }
    };
    loadBusiness();
  }, []);

  return (
    <Sidebar className="bg-[#0f172a] text-white" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-custom-5/20 rounded-md"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5 text-custom-10" />
                <span className="text-base font-semibold">{businessName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: businessName,
            email: businessEmail,
            avatar: "/avatars/shadcn.jpg", // replace with your fallback if needed
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
