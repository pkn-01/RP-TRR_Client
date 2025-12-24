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
    { value: "NOT_PRINTING", label: "ไม่สามารถพิมพ์ได้" },
    { value: "LOW_QUALITY", label: "คุณภาพการพิมพ์ต่ำ" },
  ],
  AIR_CONDITIONING: [
    { value: "NOT_COOLING", label: "ไม่เย็น" },
    { value: "NOISY", label: "มีเสียงดัง" },
    { value: "LEAKING", label: "รั่วซึม" },
  ],
  ELECTRICITY: [
    { value: "POWER_OUTAGE", label: "ไฟฟ้าขาด" },
    { value: "OUTLET_BROKEN", label: "เต้าปลั๊กเสีย" },
    { value: "WIRING_ISSUE", label: "ปัญหาการต่อสาย" },
  ],
  OTHER: [{ value: "OTHER_ISSUE", label: "ปัญหาอื่นๆ" }],
};

interface FormData {
  problemCategory: string;
  problemSubcategory: string;
  equipmentName: string;
  location: string;
  title: string;
  description: string;
  priority: string;
  phoneNumber: string;
  lineId: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CreateLineOAContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lineUserId = searchParams.get("lineUserId");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    problemCategory: "",
    problemSubcategory: "",
    equipmentName: "",
    location: "",
    title: "",
    description: "",
    priority: "MEDIUM",
    phoneNumber: "",
    lineId: "",
  });

  const isFromLINE = !!lineUserId;

  useEffect(() => {
    if (!isFromLINE) {
      const hasToken = localStorage.getItem("token");
      if (!hasToken) {
        router.push("/login");
      }
    }
  }, [isFromLINE, router]);

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

      // Append files
      files.forEach((file) => {
        formDataToSend.append("files", file);
      });

      // For LINE users without account, create as guest/public ticket
      if (isFromLINE && !localStorage.getItem("token")) {
        const headers: Record<string, string> = {};
        if (lineUserId) {
          headers["X-LINE-USER-ID"] = lineUserId;
        }

        const response = await fetch("/api/tickets/line-oa", {
          method: "POST",
          body: formDataToSend,
          headers,
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
        // For authenticated users
        const response = await apiFetch("/api/tickets", {
          method: "POST",
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error("Failed to create ticket");
        }

        setSuccess(true);

        setTimeout(() => {
          router.push("/tickets");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle2 size={64} className="text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-800 mb-2">สำเร็จ!</h1>
          <p className="text-slate-600 mb-4">
            แจ้งซ่อมของคุณถูกสร้างเรียบร้อยแล้ว
          </p>
          {isFromLINE ? (
            <p className="text-sm text-slate-500">กำลังกลับไปยัง LINE OA...</p>
          ) : (
            <p className="text-sm text-slate-500">
              กำลังไปยังหน้ารายการแจ้งซ่อม...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
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
              <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-red-600 mb-2">
                  เกิดข้อผิดพลาด
                </h2>
                <p className="text-slate-600">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setStep(1);
                  }}
                  className="mt-4 bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
                >
                  ลองอีกครั้ง
                </button>
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
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          ย้อนกลับ
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {isFromLINE ? "แจ้งซ่อม (LINE OA)" : "สร้างแจ้งซ่อมใหม่"}
          </h1>
          <p className="text-slate-600">
            กรุณากรอกข้อมูลการแจ้งซ่อม{" "}
            {isFromLINE ? "(ไม่จำเป็นต้องกรอกทั้งหมด)" : ""}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex justify-between items-center">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex items-center ${s < 4 ? "flex-1" : ""}`}
            >
              <button
                onClick={() => setStep(s)}
                className={`w-8 h-8 rounded-full font-bold transition-all ${
                  s <= step
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {s}
              </button>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full ${
                    s < step ? "bg-blue-600" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Problem Category */}
          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                  1
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  ประเภทปัญหา
                </h2>
              </div>

              <SelectField
                label="เลือกประเภท"
                value={formData.problemCategory}
                onChange={handleCategoryChange}
                options={PROBLEM_CATEGORIES}
                error={errors.problemCategory}
                required
              />

              {formData.problemCategory && (
                <SelectField
                  label="เลือกประเภทย่อย"
                  value={formData.problemSubcategory}
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      problemSubcategory: value,
                    });
                    setErrors({ ...errors, problemSubcategory: "" });
                  }}
                  options={SUBCATEGORIES[formData.problemCategory] || []}
                  error={errors.problemSubcategory}
                  required
                />
              )}

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
              >
                ถัดไป
              </button>
            </div>
          )}

          {/* Step 2: Equipment Info */}
          {step === 2 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                  2
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  ข้อมูลอุปกรณ์
                </h2>
              </div>

              <div className="space-y-4">
                <InputField
                  label="ชื่ออุปกรณ์"
                  placeholder="เช่น คอมพิวเตอร์ตั้งโต๊ะ, เครื่องปริ้นเตอร์"
                  value={formData.equipmentName}
                  onChange={(value) => {
                    setFormData({ ...formData, equipmentName: value });
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
                  onChange={(value) => {
                    setFormData({ ...formData, location: value });
                  }}
                  icon={<MapPin size={18} />}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl hover:bg-slate-300 transition-colors"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Description */}
          {step === 3 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                  3
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  รายละเอียด
                </h2>
              </div>

              <InputField
                label="หัวเรื่อง"
                placeholder="สรุปสั้นๆ เกี่ยวกับปัญหา"
                value={formData.title}
                onChange={(value) => {
                  setFormData({ ...formData, title: value });
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
                options={[
                  { value: "LOW", label: "ต่ำ" },
                  { value: "MEDIUM", label: "ปานกลาง" },
                  { value: "HIGH", label: "ด่วน" },
                ]}
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl hover:bg-slate-300 transition-colors"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Contact Info & File Upload */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Contact Info */}
              {isFromLINE && (
                <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      4
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      ข้อมูลติดต่อ (ไม่บังคับ)
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <InputField
                      label="เบอร์โทรศัพท์"
                      placeholder="0812345678"
                      value={formData.phoneNumber}
                      onChange={(value) =>
                        setFormData({ ...formData, phoneNumber: value })
                      }
                      icon={<Phone size={18} />}
                    />

                    <InputField
                      label="LINE ID"
                      placeholder="ตัวอักษรของ LINE ID ของคุณ"
                      value={formData.lineId}
                      onChange={(value) =>
                        setFormData({ ...formData, lineId: value })
                      }
                      icon={<MessageCircle size={18} />}
                    />
                  </div>
                </div>
              )}

              {/* File Upload */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Paperclip size={20} className="text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    ไฟล์แนบ (ไม่บังคับ)
                  </h2>
                </div>

                <FileUpload
                  label="อัปโหลดไฟล์สำเร็จ"
                  files={files}
                  onFilesChange={setFiles}
                  maxFiles={5}
                  maxSizeMB={10}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl hover:bg-slate-300 transition-colors"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      กำลังสร้าง...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      ส่งแจ้งซ่อม
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
