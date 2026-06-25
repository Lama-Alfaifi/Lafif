"use client";

const members = [
  {
    name: "محمد",
    role: "رئيس النادي",
  },
  {
    name: "سارة",
    role: "منظم فعاليات",
  },
  {
    name: "أحمد",
    role: "عضو",
  },
];

export default function Members() {

  return (

    <div
      className="
        bg-white
        rounded-[32px]
        p-6
        shadow-xl
      "
    >

      <h1
        className="
          text-3xl font-black
          text-[#0F172A]
        "
      >
        أعضاء النادي
      </h1>

      <div className="mt-8 flex flex-col gap-4">

        {members.map((member, index) => (

          <div
            key={index}
            className="
              flex items-center justify-between
              bg-gray-50
              rounded-2xl
              p-4
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  w-14 h-14 rounded-full
                  bg-gradient-to-br
                  from-cyan-500
                  to-emerald-500
                "
              />

              <div>

                <h1 className="font-bold">
                  {member.name}
                </h1>

                <p className="text-sm text-gray-500">
                  {member.role}
                </p>

              </div>

            </div>

            <div
              className="
                w-3 h-3 rounded-full
                bg-emerald-500
              "
            />

          </div>

        ))}

      </div>

    </div>

  );

}