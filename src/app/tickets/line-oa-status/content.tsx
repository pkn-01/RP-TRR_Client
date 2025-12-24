"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Wrench,
  AlertCircle,
  MessageCircle,
  Calendar,
  MapPin,
  User,
} from "lucide-react";

interface TicketProgress {
  id: number;
  ticketCode: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  equipmentName: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  };
  logs?: Array<{
    id: number;
    status: string;
    comment?: string;
    createdAt: string;
    user: {
      name: string;
    };
  }>;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "OPEN":
      return <Clock className="text-amber-500" size={24} />;
    case "IN_PROGRESS":
      return <Wrench className="text-blue-500" size={24} />;
    case "DONE":
      return <CheckCircle2 className="text-green-500" size={24} />;
    default:
      return <AlertCircle className="text-slate-500" size={24} />;
  }
};

const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    OPEN: "รอรับเรื่อง",
    IN_PROGRESS: "กำลังซ่อม",
    DONE: "ซ่อมเสร็จแล้ว",
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "OPEN":
      return "border-amber-200 bg-amber-50";
    case "IN_PROGRESS":
      return "border-blue-200 bg-blue-50";
    case "DONE":
      return "border-green-200 bg-green-50";
    default:
      return "border-slate-200 bg-slate-50";
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
      return "text-green-600";
    case "MEDIUM":
      return "text-amber-600";
    case "HIGH":
      return "text-red-600";
    default:
      return "text-slate-600";
  }
};

export default function LineOATicketStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketIdParam = searchParams.get("ticketId");
  const lineUserId = searchParams.get("lineUserId");

  const [ticket, setTicket] = useState<TicketProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketIdParam) {
        setError("ไม่พบรหัสแจ้งซ่อม");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/tickets/${ticketIdParam}`);
        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลแจ้งซ่อม");
        }
        const data = await response.json();
        setTicket(data);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicket();
  }, [ticketIdParam]);

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

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
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
                <h2 className="text-xl font-bold text-slate-900">
                  ไม่สามารถโหลดข้อมูล
                </h2>
                <p className="text-slate-600 mt-2">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
        >
          <ArrowLeft size={20} />
          ย้อนกลับ
        </button>

        {/* Main Status Card */}
        <div
          className={`bg-white rounded-2xl shadow-sm border-2 p-6 mb-6 ${getStatusColor(
            ticket.status
          )}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {ticket.ticketCode}
              </h1>
              <h2 className="text-xl text-slate-700">{ticket.title}</h2>
            </div>
            <div className="text-right">
              {getStatusIcon(ticket.status)}
              <p className="font-bold text-lg mt-2">
                {getStatusLabel(ticket.status)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-start gap-3">
              <Wrench size={18} className="text-slate-600 mt-1" />
              <div>
                <p className="text-xs text-slate-600">ความเร่งด่วน</p>
                <p className={`font-bold ${getPriorityColor(ticket.priority)}`}>
                  {getPriorityLabel(ticket.priority)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-slate-600 mt-1" />
              <div>
                <p className="text-xs text-slate-600">วันที่สร้าง</p>
                <p className="font-semibold text-slate-900">
                  {formatDate(ticket.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-slate-600 mt-1" />
              <div>
                <p className="text-xs text-slate-600">สถานที่</p>
                <p className="font-semibold text-slate-900">
                  {ticket.location}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-slate-600 mt-1" />
              <div>
                <p className="text-xs text-slate-600">อุปกรณ์</p>
                <p className="font-semibold text-slate-900">
                  {ticket.equipmentName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-3">
            รายละเอียดปัญหา
          </h3>
          <p className="text-slate-700 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        {/* Timeline / Progress */}
        {ticket.logs && ticket.logs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              📅 ประวัติการอัพเดต
            </h3>

            <div className="space-y-4">
              {/* Current Status */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-md">
                    {getStatusIcon(ticket.status)}
                  </div>
                  <div className="w-0.5 h-12 bg-slate-200"></div>
                </div>
                <div className="pt-2">
                  <p className="font-bold text-slate-900">
                    {getStatusLabel(ticket.status)} (ปัจจุบัน)
                  </p>
                  <p className="text-sm text-slate-600">
                    {formatDate(ticket.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Log History */}
              {ticket.logs.map((log, index) => (
                <div key={log.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-sm">
                      <Clock size={20} />
                    </div>
                    {index < ticket.logs!.length - 1 && (
                      <div className="w-0.5 h-12 bg-slate-200"></div>
                    )}
                  </div>
                  <div className="pt-2">
                    <p className="font-semibold text-slate-900">
                      {getStatusLabel(log.status)}
                    </p>
                    {log.comment && (
                      <p className="text-slate-700 text-sm mt-1">
                        {log.comment}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      โดย {log.user.name} • {formatDate(log.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {ticket.user && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              👤 ข้อมูลผู้แจ้ง
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User size={18} className="text-slate-600" />
                <div>
                  <p className="text-xs text-slate-600">ชื่อ</p>
                  <p className="font-semibold text-slate-900">
                    {ticket.user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-slate-600" />
                <div>
                  <p className="text-xs text-slate-600">อีเมล</p>
                  <p className="font-semibold text-slate-900">
                    {ticket.user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
