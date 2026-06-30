"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/features/i18n/context/LanguageContext";

export default function CountdownCard() {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-06-01T18:00:00");

    const updateCountdown = () => {
      const now = new Date();

      const diff =
        targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      const days = Math.floor(
        diff / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (diff / (1000 * 60 * 60)) % 24
      );

      const minutes = Math.floor(
        (diff / (1000 * 60)) % 60
      );

      const seconds = Math.floor(
        (diff / 1000) % 60
      );

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
      });
    };

    updateCountdown();

    const interval =
      setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-[20px] bg-gradient-to-r from-[#5B3DF5] to-[#7B61FF] px-6 py-3 text-white shadow-lg flex items-center justify-between">
      <h1 className="text-base lg:text-lg font-bold">
        {t.dashboard.countdown}
      </h1>

      <div className="flex items-center gap-5">
        
        <div className="text-center">
          <h2 className="text-2xl font-black leading-none">
            {timeLeft.days}
          </h2>

          <p className="text-[11px] opacity-90 mt-1">{t.dashboard.days}</p>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black leading-none">{timeLeft.hours}</h2>
          <p className="text-[11px] opacity-90 mt-1">{t.dashboard.hours}</p>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black leading-none">{timeLeft.minutes}</h2>
          <p className="text-[11px] opacity-90 mt-1">{t.dashboard.minutes}</p>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black leading-none">{timeLeft.seconds}</h2>
          <p className="text-[11px] opacity-90 mt-1">{t.dashboard.seconds}</p>
        </div>

      </div>
    </div>
  );
}