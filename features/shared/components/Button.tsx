"use client";

type ButtonProps = {
  text: string;
};

export default function Button({
  text,
}: ButtonProps) {

  return (

    <button
      className="
        px-6 py-3 rounded-2xl
        bg-[#0F172A]
        text-white
        font-bold
        hover:scale-105
        active:scale-95
        transition-all duration-300
      "
    >
      {text}
    </button>

  );

}