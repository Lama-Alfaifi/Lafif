"use client";

import { useEffect, useState } from "react";

export default function LandingStatistics() {

  const [clubs, setClubs] = useState(0);
  const [students, setStudents] = useState(0);
  const [events, setEvents] = useState(0);

  useEffect(() => {

    const clubsInterval = setInterval(() => {
      setClubs((prev) => {
        if (prev >= 120) {
          clearInterval(clubsInterval);
          return 120;
        }
        return prev + 2;
      });
    }, 20);

    const studentsInterval = setInterval(() => {
      setStudents((prev) => {
        if (prev >= 3000) {
          clearInterval(studentsInterval);
          return 3000;
        }
        return prev + 50;
      });
    }, 20);

    const eventsInterval = setInterval(() => {
      setEvents((prev) => {
        if (prev >= 85) {
          clearInterval(eventsInterval);
          return 85;
        }
        return prev + 1;
      });
    }, 30);

  }, []);

  return (
    <div className="flex gap-12 mt-10">

      <div>
        <h2 className="text-3xl font-bold text-[#0F172A]">
          +{clubs}
        </h2>

        <p className="text-gray-500 text-sm">
          نادي جامعي
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-[#0F172A]">
          +{students}
        </h2>

        <p className="text-gray-500 text-sm">
          طالب
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-[#0F172A]">
          +{events}
        </h2>

        <p className="text-gray-500 text-sm">
          فعالية
        </p>
      </div>

    </div>
  );
}