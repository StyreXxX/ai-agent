import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { AppWindow } from "lucide-react"
import Image from "next/image"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarHeader className="flex flex-row gap-2.5 items-center px-4 py-4">
        <Image src = {"/logo.svg"} alt = "logo" width = {40} height = {40} />
        <h2 className = " font-semiBold text-lg text-slate-900 ">Groovi Ai</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenuButton className="h-12 gap-3 hover:bg-slate-100">
              <div className="flex h-9 w-8 shrink-0 bg-blue-100 items-center justify-center rounded-lg">
                <AppWindow className="h-[18px] w-[18px text-blue-900" />
              </div>
              <span>Dashboard</span>
            </SidebarMenuButton>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}