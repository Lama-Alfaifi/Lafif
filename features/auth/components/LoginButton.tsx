import Link from "next/link";
export default function LoginButton() {
  return (
<Link href="/login">

  <button
    className="
      mt-12 px-8 py-4 rounded-2xl text-lg
      bg-gradient-to-r from-cyan-500 to-emerald-500
      text-white
      hover:scale-105
      transition-all duration-300
    "
  >
    تسجيل الدخول
  </button>

</Link>
  );
}