"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Wrench,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

interface Ticket {
  id: number;
  ticketCode: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "OPEN":
      return <Clock className="text-amber-500" size={20} />;
    case "IN_PROGRESS":
      return <Wrench className="text-blue-500" size={20} />;
    case "DONE":
      return <CheckCircle2 className="text-green-500" size={20} />;
    default:
      return <Clock className="text-slate-400" size={20} />;
  }
};

const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    OPEN: "เปิดใหม่",
    IN_PROGRESS: "กำลังดำเนินการ",
    DONE: "เสร็จสิ้น",
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "OPEN":
      return "text-amber-600";
    case "IN_PROGRESS":
      return "text-blue-600";
    case "DONE":
      return "text-green-600";
    default:
      return "text-slate-600";
  }
};

const getPriorityLabel = (priority: string): string => {
  const priorityMap: { [key: string]: string } = {
    LOW: "ต่ำ",
    MEDIUM: "ปานกลาง",
    HIGH: "ด่วน",
  };
  return priorityMap[priority] || priority;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "LOW":
      return "bg-green-100 text-green-800";
    case "MEDIUM":
      return "bg-amber-100 text-amber-800";
    case "HIGH":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

export default function LineOATicketListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lineUserId = searchParams.get("lineUserId");

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!lineUserId) {
        setError("ไม่พบ LINE User ID");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch tickets for this LINE user
        const response = await fetch(`/api/tickets?lineUserId=${lineUserId}`);
        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลแจ้งซ่อม");
        }
        const data = await response.json();
        setTickets(Array.isArray(data) ? data : data.data || []);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [lineUserId]);

  const handleBackToMenu = () => {
    if (lineUserId) {
      window.location.href = `line://oaMessage/${lineUserId}`;
    }
  };

  const handleTicketClick = (ticketId: number) => {
    router.push(
      `/tickets/line-oa-status?ticketId=${ticketId}&lineUserId=${lineUserId}`
    );
  };

  const handleCreateNew = () => {
    router.push(`/tickets/create-line-oa?lineUserId=${lineUserId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleBackToMenu}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
          >
            <ArrowLeft size={20} />
            ย้อนกลับ
          </button>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex gap-3 items-start">
              <AlertCircle
                size={24}
                className="text-red-600 flex-shrink-0 mt-1"
              />
              <div>
                <h2 className="text-lg font-bold text-red-600 mb-2">
                  เกิดข้อผิดพลาด
                </h2>
                <p className="text-slate-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={handleBackToMenu}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          ย้อนกลับ
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            แจ้งซ่อมของฉัน
          </h1>
          <p className="text-slate-600">
            {tickets.length === 0
              ? "คุณยังไม่มีแจ้งซ่อม"
              : `คุณมีแจ้งซ่อมทั้งหมด ${tickets.length} รายการ`}
          </p>
        </div>

        {/* Create New Button */}
        <button
          onClick={handleCreateNew}
          className="w-full mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-shadow"
        >
          + สร้างแจ้งซ่อมใหม่
        </button>

        {/* Tickets List */}
        {tickets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle size={48} className="text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">
              คุณยังไม่มีแจ้งซ่อม กรุณาสร้างแจ้งซ่อมใหม่
            </p>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              สร้างแจ้งซ่อมใหม่
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => handleTicketClick(ticket.id)}
                className="w-full bg-white rounded-xl shadow hover:shadow-md transition-shadow p-4 text-left border border-slate-100 hover:border-blue-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Header with Status */}
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(ticket.status)}
                      <span
                        className={`text-sm font-semibold ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {getStatusLabel(ticket.status)}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {getPriorityLabel(ticket.priority)}
                      </span>
                    </div>

                    {/* Ticket Code and Title */}
                    <h3 className="font-semibold text-slate-800 text-sm mb-1 truncate">
                      {ticket.ticketCode}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                      {ticket.title}
                    </p>

                    {/* Date */}
                    <p className="text-xs text-slate-500">
                      {new Date(ticket.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <ChevronRight
                    size={20}
                    className="text-blue-600 flex-shrink-0 mt-1"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
