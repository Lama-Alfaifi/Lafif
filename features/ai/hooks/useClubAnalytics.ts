"use client";

import {

  useEffect,
  useState,

}
from "react";

import {

  doc,
  getDoc,

}
from "firebase/firestore";

import { db }
from "@/src/lib/firebase";

export default function
useClubAnalytics() {

  const [

    analytics,

    setAnalytics,

  ] = useState<any>(null);

  const [

    loading,

    setLoading,

  ] = useState(true);

  useEffect(() => {

    async function
    fetchAnalytics() {

      try {

        const ref =
          doc(

            db,

            "clubs",

            "cyber_club"

          );

        const snapshot =
          await getDoc(ref);

        const data =
          snapshot.data();

        setAnalytics({

          score:
          data?.score || 0,

          attendance:
          data?.attendance || 0,

          engagement:
          data?.engagement || 0,

          challengeCompletion:
          data?.challengeCompletion || 0,

          insight: {

            status:
            "النادي يحقق أداء ممتاز",

            recommendation:
            "ننصح بإضافة تحديات وورش جديدة",

          },

        });

      }

      catch (error) {

        console.log(error);

      }

      finally {

        setLoading(false);

      }

    }

    fetchAnalytics();

  }, []);

  return {

    analytics,

    loading,

  };

}