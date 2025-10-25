"use client";

import Link from "next/link"
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Share2,
  MessagesSquare,
  User,
  Settings,
  LogOut,
  Activity
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Helper function to check if menu is active
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-3">
            <img
              src="/risara.png"
              alt="Risara Logo"
              className="h-10 w-auto"
            />
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className={`${navigationMenuTriggerStyle()} relative ${
                    isActive('/dashboard')
                      ? 'bg-blue-50 text-blue-700 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/social-monitoring" legacyBehavior passHref>
                  <NavigationMenuLink className={`${navigationMenuTriggerStyle()} relative ${
                    isActive('/social-monitoring')
                      ? 'bg-red-50 text-red-700 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600'
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  }`}>
                    <Activity className="mr-2 h-4 w-4" />
                    Social Monitoring
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/network-analysis" legacyBehavior passHref>
                  <NavigationMenuLink className={`${navigationMenuTriggerStyle()} relative ${
                    isActive('/network-analysis')
                      ? 'bg-purple-50 text-purple-700 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                  }`}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Network Analysis
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/citizen-engagement" legacyBehavior passHref>
                  <NavigationMenuLink className={`${navigationMenuTriggerStyle()} relative ${
                    isActive('/citizen-engagement')
                      ? 'bg-green-50 text-green-700 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-600'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}>
                    <MessagesSquare className="mr-2 h-4 w-4" />
                    Citizen Engagement
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="@admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}