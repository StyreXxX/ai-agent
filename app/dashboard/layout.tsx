import React from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/custom/dashboard/AppSidebar'

function Dashboardlayout({children}: any){
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarTrigger/>
            <div>{children}</div>
        </SidebarProvider>
    )
}
export default Dashboardlayout