"use client";

import { useState } from "react";

export default function useCalendar() {
  const today = new Date();

  const [month, setMonth] =
    useState(today.getMonth() + 1);

  const [year, setYear] =
    useState(today.getFullYear());

  function goNextMonth() {
    if (month === 12) {
      setMonth(1);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  }

  function goPrevMonth() {
    if (month === 1) {
      setMonth(12);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  }

  return {
    month,
    year,
    goNextMonth,
    goPrevMonth,
  };
}