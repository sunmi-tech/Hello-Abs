import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>
        <SidebarProvider>
          <AppSidebar />
          {children}
        </SidebarProvider>
      </div>
  );
}
