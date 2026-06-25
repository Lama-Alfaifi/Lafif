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
useChallenges() {

  const [

    challenges,

    setChallenges,

  ] = useState<any[]>([]);

  const [

    loading,

    setLoading,

  ] = useState(true);

  useEffect(() => {

    async function
    fetchChallenges() {

      try {

        const snapshot =
          await getDocs(

            collection(
              db,
              "challenges"
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

        setChallenges(data);

      }

      catch (error) {

        console.log(error);

      }

      finally {

        setLoading(false);

      }

    }

    fetchChallenges();

  }, []);

  return {

    challenges,

    loading,

  };

}