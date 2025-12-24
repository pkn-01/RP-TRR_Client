"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  User,
  Package,
} from "lucide-react";

interface MenuItem {
  icon: React.ComponentType<{ size: number; strokeWidth?: number }>;
  label: string;
  href: string;
  subItems?: Array<{ label: string; href: string }>;
}

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: "แดชบอร์ด", href: "/admin/dashboard" },
    {
      icon: Wrench,
      label: "งานซ่อมแซม",
      href: "/admin/repairs",
      subItems: [
        { label: "รายการทั้งหมด", href: "/admin/repairs" },
        // { label: 'รอการอนุมัติ', href: '/admin/repairs?status=pending' },
        // { label: 'กำลังดำเนินการ', href: '/admin/repairs?status=in-progress' },
        // { label: 'เสร็จสิ้น', href: '/admin/repairs?status=completed' },
      ],
    },
    { icon: Package, label: "ระบบยืมของ", href: "/admin/loans" },
    { icon: Users, label: "จัดการผู้ใช้งาน", href: "/admin/users" },
    {
      icon: Settings,
      label: "ตั้งค่าระบบ",
      href: "/admin/settings",
      subItems: [
        { label: "ข้อมูลทั่วไป", href: "/admin/settings" },
        { label: "สิทธิ์เข้าถึง", href: "/admin/settings/permissions" },
      ],
    },
  ];

  useEffect(() => setIsOpen(false), [pathname]);

  const toggleSubMenu = useCallback((label: string) => {
    setExpandedMenu((prev) => (prev === label ? null : label));
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    localStorage.clear();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 md:h-14 bg-white border-b border-zinc-200 z-50 px-4 sm:px-6 flex items-center justify-between safe-top">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-semibold text-sm sm:text-base text-zinc-900 tracking-tight">
            TRR-RP
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 -mr-2 text-zinc-500 hover:text-zinc-700 transition-colors active:bg-zinc-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 sm:w-72 bg-white border-r border-zinc-200 transition-transform duration-300 ease-out z-[60] overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Branding */}
        <div className="h-20 md:h-16 flex items-center px-8 pt-safe-top">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-md font-bold text-zinc-900 tracking-tight">
                TRR-RP
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-3 sm:px-4 py-4 space-y-1 pb-32">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedMenu === item.label;
            const isActive = pathname.startsWith(item.href);

            return (
              <div key={item.label}>
                {item.subItems ? (
                  <button
                    onClick={() => toggleSubMenu(item.label)}
                    className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-lg transition-all group min-h-[44px] ${
                      isExpanded || isActive
                        ? "bg-zinc-100 text-zinc-900"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 active:bg-zinc-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <span
                        className={
                          isActive || isExpanded
                            ? "text-zinc-900 flex-shrink-0"
                            : "text-zinc-400 group-hover:text-zinc-900 flex-shrink-0"
                        }
                      >
                        <Icon size={18} strokeWidth={1.5} />
                      </span>
                      <span className="text-sm font-medium truncate">
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={`transition-transform duration-200 flex-shrink-0 ml-auto ${
                        isExpanded ? "rotate-180" : "opacity-40"
                      }`}
                    >
                      <ChevronDown size={14} />
                    </span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-lg transition-all group min-h-[44px] ${
                      isActive
                        ? "bg-zinc-200 text-zinc-900"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span
                      className={
                        isActive
                          ? "text-zinc-900 flex-shrink-0"
                          : "text-zinc-400 group-hover:text-zinc-900 flex-shrink-0"
                      }
                    >
                      <Icon size={18} strokeWidth={1.5} />
                    </span>
                    <span className="text-sm font-medium truncate">
                      {item.label}
                    </span>
                  </Link>
                )}

                {/* Submenu */}
                {item.subItems && isExpanded && (
                  <div className="mt-1 ml-3 sm:ml-4 border-l border-zinc-200">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className={`block py-2 px-4 sm:px-6 text-xs font-medium transition-colors min-h-[40px] flex items-center ${
                          pathname === sub.href
                            ? "text-zinc-900 bg-zinc-100"
                            : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile Area */}
        <div className="absolute bottom-0 left-0 right-0 w-full p-3 sm:p-4 border-t border-zinc-100 bg-zinc-50/50 safe-bottom">
          <div className="flex items-center gap-2 sm:gap-3 px-2 py-3">
            <div className="w-10 h-10 min-w-[40px] rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 flex-shrink-0">
              <User size={18} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-zinc-800 truncate">
                PKN
              </span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-tight truncate">
                Administrator
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              className="flex items-center justify-center p-3 sm:p-2 rounded-md bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-400 transition-all active:bg-zinc-100 min-h-[44px]"
              aria-label="Notifications"
            >
              <Bell size={16} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-3 sm:p-2 rounded-md bg-white border border-zinc-200 text-zinc-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all active:bg-red-100 min-h-[44px]"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-[55]"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
