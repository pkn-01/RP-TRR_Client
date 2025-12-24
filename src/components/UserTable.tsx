"use client";

import { User } from "@/services/userService";
import { Trash2, ChevronRight, Loader2, Edit2 } from "lucide-react";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading?: boolean;
}

export default function UserTable({
  users,
  onEdit,
  onDelete,
  isLoading = false,
}: UserTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl border border-slate-100">
        <Loader2 className="animate-spin text-slate-300 mb-2" size={32} />
        <p className="text-slate-400 text-sm font-medium">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-xl border border-slate-100">
        <p className="text-slate-400 font-medium">
          ไม่พบรายชื่อผู้ใช้งานในระบบ
        </p>
      </div>
    );
  }

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "IT":
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: "ผู้ดูแลระบบ",
      IT: "ทีมไอที",
      USER: "ผู้ใช้งาน",
    };
    return labels[role] || role;
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                ชื่อ-นามสกุล
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                ข้อมูลติดต่อ
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                บทบาท
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                ส่ง/รับงาน
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr
                key={user.id}
                className="group hover:bg-slate-50/80 transition-all duration-200"
              >
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="font-semibold text-slate-900 text-sm">
                    {user.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {user.department || "ไม่ระบุแผนก"}
                  </div>
                </td>

                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="text-sm text-slate-600 truncate">
                    {user.email}
                  </div>
                  <div className="text-xs text-slate-400">
                    {user.phoneNumber || "-"}
                  </div>
                </td>

                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border ${getRoleStyle(
                      user.role
                    )}`}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </td>

                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                  <div className="text-sm font-semibold text-slate-700">
                    {user._count?.tickets || 0} /{" "}
                    <span className="text-indigo-600">
                      {user._count?.assigned || 0}
                    </span>
                  </div>
                </td>

                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(user)}
                      className="flex items-center gap-1 px-3 py-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 rounded-lg transition-all font-medium text-sm min-h-[40px]"
                      aria-label="Edit user"
                    >
                      <ChevronRight
                        size={18}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 active:bg-rose-100 rounded-lg transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
                      title="ลบ"
                      aria-label="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-3">
              {/* Header with name and role */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-base truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {user.department || "ไม่ระบุแผนก"}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border flex-shrink-0 ${getRoleStyle(
                    user.role
                  )}`}
                >
                  {getRoleLabel(user.role)}
                </span>
              </div>

              {/* Contact information */}
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div>
                  <div className="text-xs text-slate-400 font-medium">
                    อีเมล
                  </div>
                  <div className="text-sm text-slate-600 break-all">
                    {user.email}
                  </div>
                </div>
                {user.phoneNumber && (
                  <div>
                    <div className="text-xs text-slate-400 font-medium">
                      เบอร์โทรศัพท์
                    </div>
                    <div className="text-sm text-slate-600">
                      {user.phoneNumber}
                    </div>
                  </div>
                )}
              </div>

              {/* Task count */}
              <div className="border-t border-slate-100 pt-3">
                <div className="text-xs text-slate-400 font-medium mb-1">
                  งาน
                </div>
                <div className="text-sm font-semibold text-slate-700">
                  ส่ง: {user._count?.tickets || 0} • รับ:{" "}
                  <span className="text-indigo-600">
                    {user._count?.assigned || 0}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-slate-100 pt-3 flex gap-2">
                <button
                  onClick={() => onEdit(user)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-3 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 rounded-lg transition-colors font-medium text-sm min-h-[44px]"
                  aria-label="Edit user"
                >
                  <Edit2 size={16} />
                  <span>แก้ไข</span>
                </button>
                <button
                  onClick={() => onDelete(user)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-3 text-rose-600 hover:bg-rose-50 active:bg-rose-100 rounded-lg transition-colors font-medium text-sm min-h-[44px]"
                  aria-label="Delete user"
                >
                  <Trash2 size={16} />
                  <span>ลบ</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
