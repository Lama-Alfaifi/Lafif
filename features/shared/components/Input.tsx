"use client";

type InputProps = {

  placeholder?: string;

  type?: string;

};

export default function Input({
  placeholder,
  type = "text",
}: InputProps) {

  return (

    <input
      type={type}
      placeholder={placeholder}
      className="
        w-full
        px-5 py-4
        rounded-2xl
        border border-gray-200
        bg-white
        text-[#0F172A]
        outline-none
        shadow-sm
        focus:ring-2
        focus:ring-cyan-400
        transition-all duration-300
      "
    />

  );

}