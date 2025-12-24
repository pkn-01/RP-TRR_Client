"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  MapPin,
  Laptop,
  Phone,
  MessageCircle,
} from "lucide-react";
import SelectField from "@/components/SelectField";
import FileUpload from "@/components/FileUpload";
import InputField from "@/components/InputField";
import { apiFetch } from "@/services/api";

const PROBLEM_CATEGORIES = [
  { value: "NETWORK", label: "เครือข่าย" },
  { value: "HARDWARE", label: "ฮาร์ดแวร์" },
  { value: "SOFTWARE", label: "ซอฟต์แวร์" },
  { value: "PRINTER", label: "เครื่องปริ้นเตอร์" },
  { value: "AIR_CONDITIONING", label: "เครื่องปรับอากาศ" },
  { value: "ELECTRICITY", label: "ไฟฟ้า" },
  { value: "OTHER", label: "อื่นๆ" },
];

const SUBCATEGORIES: {
  [key: string]: Array<{ value: string; label: string }>;
} = {
  NETWORK: [
    { value: "INTERNET_DOWN", label: "อินเทอร์เน็ตขาด" },
    { value: "SLOW_CONNECTION", label: "การเชื่อมต่อช้า" },
    { value: "WIFI_ISSUE", label: "ปัญหา WiFi" },
  ],
  HARDWARE: [
    { value: "MONITOR_BROKEN", label: "จอมอนิเตอร์เสีย" },
    { value: "KEYBOARD_BROKEN", label: "แป้นพิมพ์เสีย" },
    { value: "MOUSE_BROKEN", label: "เมาส์เสีย" },
    { value: "COMPUTER_CRASH", label: "คอมพิวเตอร์ค้าง" },
  ],
  SOFTWARE: [
    { value: "INSTALLATION", label: "ติดตั้งซอฟต์แวร์" },
    { value: "LICENSE", label: "ปัญหาลิขสิทธิ์" },
    { value: "PERFORMANCE", label: "ปัญหาประสิทธิภาพ" },
  ],
  PRINTER: [
    { value: "JAM", label: "กระดาษค้าง" },
    { value: "NO_PRINTING", label: "ไม่สามารถพิมพ์ได้" },
    { value: "CARTRIDGE", label: "ปัญหาตลับหมึก" },
  ],
  AIR_CONDITIONING: [
    { value: "INSTALLATION_AC", label: "ติดตั้ง" },
    { value: "MALFUNCTION_AC", label: "ขัดข้อง" },
  ],
  ELECTRICITY: [
    { value: "POWER_DOWN", label: "ไฟฟ้าดับ" },
    { value: "LIGHT_PROBLEM", label: "ปัญหาแสงสว่าง" },
  ],
  OTHER: [{ value: "OTHER", label: "อื่นๆ" }],
};

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "ต่ำ" },
  { value: "MEDIUM", label: "ปานกลาง" },
  { value: "HIGH", label: "ด่วน" },
];

export default function CreateLineOARepair() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lineUserId = searchParams.get("lineUserId");

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [success, setSuccess] = useState(false);
  const [isFromLINE] = useState(!!lineUserId);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Simplified form for LINE OA - optional fields with optional phone and LINE ID
  const [formData, setFormData] = useState({
    problemCategory: "",
    problemSubcategory: "",
    equipmentName: "",
    title: "",
    description: "",
    phoneNumber: "", // optional
    lineId: "", // optional
    location: "N/A", // can be filled
    priority: "MEDIUM",
  });

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      problemCategory: value,
      problemSubcategory: "",
    });
    setErrors({ ...errors, problemCategory: "" });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.problemCategory)
      newErrors.problemCategory = "กรุณาเลือกประเภท";
    if (!formData.problemSubcategory)
      newErrors.problemSubcategory = "กรุณาเลือกประเภทย่อย";
    if (!formData.equipmentName.trim())
      newErrors.equipmentName = "กรุณากรอกชื่ออุปกรณ์";
    if (!formData.title.trim()) newErrors.title = "กรุณากรอกหัวเรื่อง";
    if (!formData.description.trim())
      newErrors.description = "กรุณากรอกรายละเอียด";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", "REPAIR");
      formDataToSend.append("priority", formData.priority);
      formDataToSend.append("problemCategory", formData.problemCategory);
      formDataToSend.append("problemSubcategory", formData.problemSubcategory);
      formDataToSend.append("equipmentName", formData.equipmentName);
      formDataToSend.append("location", formData.location || "N/A");

      // Optional LINE OA metadata
      if (lineUserId) {
        formDataToSend.append("lineUserId", lineUserId);
      }
      if (formData.phoneNumber.trim()) {
        formDataToSend.append("phoneNumber", formData.phoneNumber);
      }
      if (formData.lineId.trim()) {
        formDataToSend.append("lineId", formData.lineId);
      }

      files.forEach((file, index) => {
        formDataToSend.append(`files`, file);
      });

      // For LINE users without account, create as guest/public ticket
      if (isFromLINE && !localStorage.getItem("token")) {
        const response = await fetch("/api/tickets/line-oa", {
          method: "POST",
          body: formDataToSend,
          headers: {
            "X-LINE-USER-ID": lineUserId,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to create ticket");
        }

        const data = await response.json();
        setSuccess(true);

        // Redirect after success
        setTimeout(() => {
          if (isFromLINE) {
            window.location.href = `line://oaid/${
              process.env.NEXT_PUBLIC_LINE_OA_ID || ""
            }`;
          } else {
            router.push("/tickets");
          }
        }, 2000);
      } else {
        // For logged-in users, use standard endpoint
        const response = await apiFetch("/api/tickets", {
          method: "POST",
          body: formDataToSend,
        });

        setSuccess(true);

        setTimeout(() => {
          router.push("/tickets");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      setErrors({
        submit: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center animate-in fade-in">
          <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            เรียบร้อยแล้ว!
          </h2>
          <p className="text-slate-600 mb-4">
            แจ้งซ่อมของคุณได้รับการบันทึกเรียบร้อยแล้ว ยินดีต้อนรับ
          </p>
          <p className="text-sm text-slate-500">
            {isFromLINE ? "กำลังกลับไปที่ LINE..." : "กำลังไปยังหน้ารายการ..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
          >
            <ArrowLeft size={20} />
            ย้อนกลับ
          </button>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              📋 แแ้งซ่อมใหม่
            </h1>
            <p className="text-slate-600">
              {isFromLINE
                ? "กรอกข้อมูลการแจ้งซ่อม (ไม่บังคับกรอกทั้งหมด)"
                : "กรอกข้อมูลการแจ้งซ่อมของคุณ"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Step 1: Problem Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                1
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                ประเภทของปัญหา
              </h2>
            </div>

            <SelectField
              label="ประเภทหลัก"
              value={formData.problemCategory}
              onChange={handleCategoryChange}
              options={PROBLEM_CATEGORIES}
              error={errors.problemCategory}
              required
            />

            {formData.problemCategory && (
              <SelectField
                label="ประเภทย่อย"
                value={formData.problemSubcategory}
                onChange={(value) => {
                  setFormData({ ...formData, problemSubcategory: value });
                  setErrors({ ...errors, problemSubcategory: "" });
                }}
                options={SUBCATEGORIES[formData.problemCategory] || []}
                error={errors.problemSubcategory}
                required
              />
            )}
          </div>

          {/* Step 2: Equipment Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                2
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                ข้อมูลอุปกรณ์
              </h2>
            </div>

            <InputField
              label="ชื่ออุปกรณ์"
              placeholder="เช่น คอมพิวเตอร์ตั้งโต๊ะ, เครื่องปริ้นเตอร์"
              value={formData.equipmentName}
              onChange={(e) => {
                setFormData({ ...formData, equipmentName: e.target.value });
                setErrors({ ...errors, equipmentName: "" });
              }}
              error={errors.equipmentName}
              icon={<Laptop size={18} />}
              required
            />

            <InputField
              label="สถานที่"
              placeholder="เช่น ห้อง 101, ชั้น 2"
              value={formData.location}
              onChange={(e) => {
                setFormData({ ...formData, location: e.target.value });
              }}
              icon={<MapPin size={18} />}
            />
          </div>

          {/* Step 3: Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                3
              </div>
              <h2 className="text-lg font-bold text-slate-900">รายละเอียด</h2>
            </div>

            <InputField
              label="หัวเรื่อง"
              placeholder="สรุปสั้นๆ เกี่ยวกับปัญหา"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setErrors({ ...errors, title: "" });
              }}
              error={errors.title}
              required
            />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                รายละเอียดเพิ่มเติม <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setErrors({ ...errors, description: "" });
                }}
                placeholder="อธิบายปัญหาที่เกิดขึ้นโดยละเอียด"
                rows={4}
                className={`w-full rounded-lg border px-4 py-3 font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description
                    ? "border-red-500"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <SelectField
              label="ความเร่งด่วน"
              value={formData.priority}
              onChange={(value) =>
                setFormData({ ...formData, priority: value })
              }
              options={PRIORITY_OPTIONS}
            />
          </div>

          {/* Step 4: Optional Contact Information (LINE OA) */}
          {isFromLINE && (
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-amber-100 text-amber-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                  4
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  ข้อมูลติดต่อ (ไม่บังคับ)
                </h2>
              </div>

              <p className="text-sm text-slate-600 mb-4">
                หากต้องการให้ทีมซ่อมติดต่อกลับ สามารถกรอกข้อมูลได้
              </p>

              <InputField
                label="เบอร์โทรศัพท์"
                placeholder="เช่น 08X-XXXX-XXXX"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                icon={<Phone size={18} />}
              />

              <InputField
                label="LINE ID"
                placeholder="ตัวอักษรของ LINE ID ของคุณ"
                value={formData.lineId}
                onChange={(e) =>
                  setFormData({ ...formData, lineId: e.target.value })
                }
                icon={<MessageCircle size={18} />}
              />
            </div>
          )}

          {/* File Upload */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Paperclip size={20} className="text-slate-600" />
              <h2 className="text-lg font-bold text-slate-900">ไฟล์แนบ</h2>
              <span className="text-xs text-slate-500">(ไม่บังคับ)</span>
            </div>

            <FileUpload
              files={files}
              onFilesChange={setFiles}
              maxFiles={5}
              maxSizeMB={10}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold transition-all flex items-center justify-center gap-2"
            >
              <Send size={20} />
              {loading ? "กำลังส่ง..." : "ส่งแจ้งซ่อม"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
