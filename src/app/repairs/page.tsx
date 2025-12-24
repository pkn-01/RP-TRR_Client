"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { apiFetch } from "@/services/api";

const problemTypes = [
  "คอมพิวเตอร์",
  "อินเทอร์เน็ต",
  "เครื่องพิมพ์",
  "โปรแกรม / ระบบ",
  "อื่น ๆ",
];

interface SuccessState {
  show: boolean;
  ticketId?: string;
}

export default function RepairPage() {
  const router = useRouter();
  const [problem, setProblem] = useState<string>("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<SuccessState>({ show: false });
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!problem) {
      setError("กรุณาเลือกประเภทปัญหา");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("problemType", problem);
      formData.append("description", description);
      if (image) formData.append("image", image);

      // Call API to create repair ticket
      const response = await apiFetch("/api/repairs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess({ show: true, ticketId: data.id });
      } else {
        const error = await response.json();
        setError(error.message || "เกิดข้อผิดพลาดในการส่งเรื่องแจ้งซ่อม");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success.show) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">แจ้งซ่อมสำเร็จ</h2>
          <p className="text-slate-600 mb-4">ระบบได้รับเรื่องเรียบร้อยแล้ว</p>
          {success.ticketId && (
            <p className="text-sm text-slate-500 mb-6">
              เลขที่เรื่อง:{" "}
              <span className="font-mono font-semibold">
                {success.ticketId}
              </span>
            </p>
          )}
          <div className="space-y-2">
            <button
              onClick={() => router.push("/notifications")}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              ตรวจสอบสถานะ
            </button>
            <button
              onClick={() => {
                setProblem("");
                setDescription("");
                setImage(null);
                setImagePreview("");
                setSuccess({ show: false });
              }}
              className="w-full border border-slate-300 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-50 transition"
            >
              แจ้งเรื่องอื่น
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-slate-600 hover:text-slate-800 font-medium flex items-center gap-2"
        >
          ← ย้อนกลับ
        </button>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Header */}
          <h1 className="text-3xl font-bold mb-2 text-slate-900">
            แจ้งซ่อม IT
          </h1>
          <p className="text-slate-600 mb-8">
            กรุณาเลือกปัญหาที่พบ ระบบจะให้ IT ติดต่อกลับในเร็ววี่ที่สุด
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Problem Type */}
          <div className="mb-8">
            <p className="font-semibold mb-3 text-slate-900">
              เลือกปัญหา <span className="text-red-500">*</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              {problemTypes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setProblem(item);
                    setError("");
                  }}
                  className={`border-2 rounded-lg py-3 px-4 text-sm font-medium transition-all ${
                    problem === item
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="font-semibold mb-3 text-slate-900">
              รายละเอียดเพิ่มเติม{" "}
              <span className="text-slate-400">(ไม่บังคับ)</span>
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="เช่น เปิดเครื่องแล้วหน้าจอไม่ขึ้น หรือ Wi-Fi ไม่สามารถเชื่อมต่อได้"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-slate-500 mt-2">
              จำนวนอักขระ: {description.length}/500
            </p>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <p className="font-semibold mb-3 text-slate-900">
              แนบรูปภาพ <span className="text-slate-400">(ไม่บังคับ)</span>
            </p>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 rounded-lg border border-slate-200"
                  />
                  <button
                    onClick={() => {
                      setImage(null);
                      setImagePreview("");
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-500">
                ไฟล์รูปภาพสูงสุด 5MB (JPG, PNG, GIF)
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!problem || loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
              !problem || loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "กำลังส่ง..." : "แจ้งซ่อม"}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">ทราบด้วย:</span> หากจำเป็น IT
            จะติดต่อกลับมาเพื่อรับรายละเอียดเพิ่มเติม
          </p>
        </div>
      </div>
    </div>
  );
}
