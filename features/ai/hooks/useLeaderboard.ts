"use client";

import {

  useEffect,
  useState,

}
from "react";

import {

  collection,
  getDocs,

}
from "firebase/firestore";

import { db }
from "@/src/lib/firebase";

export default function
useLeaderboard() {

  const [

    clubs,

    setClubs,

  ] = useState<any[]>([]);

  useEffect(() => {

    async function
   fetchLeaderboard() {

      try {

        const snapshot =
          await getDocs(

            collection(
              db,
              "clubs"
            )

          );

        const data =
          snapshot.docs.map(

            (doc) => ({

              id:
              doc.id,

              ...doc.data(),

            })

          );

        const sorted =
          data.sort(

            (a: any, b: any) =>

              b.score - a.score

          );

        setClubs(sorted);

      }

      catch (error) {

        console.log(error);

      }

    }

    fetchLeaderboard();

  }, []);

  return clubs;

}