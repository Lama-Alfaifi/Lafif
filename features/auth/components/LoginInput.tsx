"use client";

type LoginInputProps = {
  label: string;
  placeholder: string;
  type: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function LoginInput({
  label,
  placeholder,
  type,
  value,
  onChange,
}: LoginInputProps) {
  return (
    <div className="w-full text-right" dir="rtl">
      {/* عنوان الحقل */}
      <label className="block text-sm font-bold text-gray-700 mb-1">
        {label}
      </label>
      
      {/* صندوق الإدخال فقط بدون أي أزرار أو فواصل تحتها */}
      <div dir="ltr">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          className="w-full h-12 rounded-xl border border-[#D9DCE3] bg-white px-4 text-sm text-[#111827] placeholder:text-[#6B7280] outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition text-left"
        />
      </div>
    </div>
  );
}