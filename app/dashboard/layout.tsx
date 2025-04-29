"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Home,
  LogOut,
  Search,
  User,
  Moon,
  Sun,
  PlusCircle,
  BarChart,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { ReactNode } from "react";
interface IUser {
  name: string;
  email: string;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<IUser>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Safe access to localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error("Error parsing user data:", e);
          setUser({} as IUser);
        }
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    router.push("/auth/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Don't render anything until client-side hydration is complete
  if (!mounted) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar className="border-r">
          <SidebarHeader className="flex items-start py-2">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">InstaEduPay</h1>
            </div>
          </SidebarHeader>
          <Separator />
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  tooltip="Dashboard"
                >
                  <a href="/dashboard">
                    <Home className="w-5 h-5" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/transactions"}
                  tooltip="Transactions"
                >
                  <a href="/dashboard/transactions">
                    <CreditCard className="w-5 h-5" />
                    <span>Transactions</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/transactions-by-school"}
                  tooltip="School Transactions"
                >
                  <a href="/dashboard/transactions-by-school">
                    <BarChart className="w-5 h-5" />
                    <span>School Transactions</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/create-payment"}
                  tooltip="Create Payment"
                >
                  <a href="/dashboard/create-payment">
                    <PlusCircle className="w-5 h-5" />
                    <span>Create Payment</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/transaction-status"}
                  tooltip="Check Status"
                >
                  <a href="/dashboard/transaction-status">
                    <Search className="w-5 h-5" />
                    <span>Check Status</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="flex flex-col space-y-4">
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" />
                    <span>Dark Mode</span>
                  </>
                )}
              </Button>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <header className="flex items-center justify-between px-6 py-4 border-b w-full">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-xl font-semibold">
                {pathname === "/dashboard" && "Dashboard"}
                {pathname === "/dashboard/transactions" && "Transactions"}
                {pathname === "/dashboard/transactions-by-school" &&
                  "School Transactions"}
                {pathname === "/dashboard/create-payment" && "Create Payment"}
                {pathname === "/dashboard/transaction-status" &&
                  "Transaction Status"}
                {pathname === "/dashboard/payment-callback" && "Payment Result"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <User className="w-5 h-5" />
              <span>{user?.name || "User"}</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 w-full">
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
