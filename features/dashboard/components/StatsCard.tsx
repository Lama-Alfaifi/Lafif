"use client";

type StatsCardProps = {
  title: string;
  value: string;
};

export default function StatsCard({
  title,
  value,
}: StatsCardProps) {

  return (

    <div
      className="
        bg-white
        rounded-[28px]
        p-5
        shadow-xl
      "
    >

      <p
        className="
          text-sm
          text-gray-500
        "
      >
        {title}
      </p>

      <h1
        className="
          mt-3
          text-4xl
          font-black
          text-[#0F172A]
        "
      >
        {value}
      </h1>

    </div>

  );

}