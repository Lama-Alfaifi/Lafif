"use client";

import { useState } from "react";

type PasswordInputProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PasswordInput({
  value,
  onChange,
}: PasswordInputProps) {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">

      <label className="text-sm text-gray-600">
        كلمة المرور
      </label>

      <div className="relative">

        <input
          type={showPassword ? "text" : "password"}
          placeholder="********"
          value={value}
          onChange={onChange}
          className="
            w-full p-3 rounded-2xl border border-gray-200
            outline-none focus:ring-2 focus:ring-cyan-400
            transition
          "
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="
            absolute right-4 top-1/2 -translate-y-1/2
            text-gray-400 hover:text-gray-700
          "
        >
          {showPassword ? "🙈" : "👁"}
        </button>

      </div>

    </div>
  );
}