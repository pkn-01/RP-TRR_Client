"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  Users,
  Settings,
  LogOut,
  ClipboardList,
} from "lucide-react";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "แดชบอร์ด",
    description: "ดูสถิติและรายงานอ้างอิง",
    href: "/admin/dashboard",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Wrench,
    label: "จัดการงานซ่อม",
    description: "บริหารรายการงานซ่อมทั้งหมด",
    href: "/admin/repairs",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: ClipboardList,
    label: "งานที่มอบหมาย",
    description: "จัดการงานของผู้รับผิดชอบ",
    href: "/admin/assigned-tasks",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Users,
    label: "จัดการผู้ใช้งาน",
    description: "บริหารบัญชีผู้ใช้และสิทธิ์การเข้าถึง",
    href: "/admin/users",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Settings,
    label: "ตั้งค่าระบบ",
    description: "กำหนดค่าพื้นฐานและการตั้งค่า",
    href: "/admin/settings",
    color: "from-green-500 to-green-600",
  },
];

export default function AdminHome() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="min-h-screen -to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40 pt-safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              Admin Portal
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mt-1 hidden sm:block">
              ระบบจัดการซ่อมแซมเครื่องอุปกรณ์
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg transition-colors font-medium text-sm sm:text-base min-h-[44px]"
            aria-label="Logout"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-safe-bottom">
        {/* Welcome Message */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            ยินดีต้อนรับ Administrator
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            เลือกส่วนที่คุณต้องการจัดการ
          </p>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group relative overflow-hidden rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                ></div>

                {/* Content */}
                <div className="relative p-5 sm:p-8 h-full min-h-[140px] sm:min-h-[160px] flex flex-col items-start justify-between text-white">
                  <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-white bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-all flex-shrink-0">
                    <Icon size={24} className="sm:w-8 sm:h-8" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 truncate">
                      {item.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-white text-opacity-90 group-hover:text-opacity-100 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-20 rounded-lg sm:rounded-xl transition-opacity"></div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-gray-200">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
            ข้อมูลอ้างอิงอย่างรวดเร็ว
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
              <div className="text-gray-600 text-xs sm:text-sm font-medium mb-2">
                งานซ่อมทั้งหมด
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                1,935
              </div>
              <p className="text-xs text-gray-500 mt-2">+12% จากเดือนที่แล้ว</p>
            </div>
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
              <div className="text-gray-600 text-xs sm:text-sm font-medium mb-2">
                กำลังดำเนินการ
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                50
              </div>
              <p className="text-xs text-gray-500 mt-2">ต้องการความสนใจ</p>
            </div>
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
              <div className="text-gray-600 text-xs sm:text-sm font-medium mb-2">
                ผู้ใช้ทั้งหมด
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                156
              </div>
              <p className="text-xs text-gray-500 mt-2">+5 ผู้ใช้ใหม่</p>
            </div>
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
              <div className="text-gray-600 text-xs sm:text-sm font-medium mb-2">
                อัตราการเสร็จสิ้น
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600">
                95.5%
              </div>
              <p className="text-xs text-gray-500 mt-2">ประสิทธิภาพดี</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
