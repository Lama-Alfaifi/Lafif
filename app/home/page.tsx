import Sidebar from "../../features/dashboard/components/Sidebar";
import Topbar from "../../features/dashboard/components/Topbar";
import CountdownCard from "../../features/dashboard/components/CountdownCard";
import ClubSection from "../../features/dashboard/components/ClubSection";

export default function HomePage() {

  return (

    <main className="flex min-h-screen bg-[#F8F6F2]">

      <Sidebar />

      <section className="flex-1 p-10 overflow-y-auto">

        <Topbar />

        <div className="mt-8">

          <CountdownCard />

        </div>

        <ClubSection
          title="الأندية المركزية"
          clubs={[

            {
              id: "medical_club",

              name:
              "نادي الطب",

              college:
              "كلية الطب",
            },

            {
              id: "nursing_club",

              name:
              "نادي التمريض",

              college:
              "كلية التمريض",
            },

            {
              id: "cyber_club",

              name:
              "نادي الحاسب والأمن السيبراني",

              college:
              "كلية الحاسب وتقنية المعلومات",
            },

            {
              id: "engineering_club",

              name:
              "نادي الهندسة",

              college:
              "كلية الهندسة",
            },

            {
              id: "business_club",

              name:
              "نادي إدارة الأعمال",

              college:
              "كلية إدارة الأعمال",
            },

          ]}
        />

        <ClubSection
          title="الأندية اللامركزية"
          clubs={[

            {
              id: "fashion_club",

              name:
              "نادي الأزياء",
            },

            {
              id: "theater_club",

              name:
              "نادي المسرح",
            },

            {
              id: "cinema_club",

              name:
              "نادي السينما",
            },

            {
              id: "photography_club",

              name:
              "نادي التصوير الضوئي",
            },

            {
              id: "culture_club",

              name:
              "نادي الثقافة",
            },

          ]}
        />

      </section>

    </main>

  );

}