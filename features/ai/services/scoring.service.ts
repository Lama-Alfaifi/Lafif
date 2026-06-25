export default function
scoringService() {

  const clubs = [

    "نادي الحاسب",
    "نادي الطب",
    "نادي الهندسة",
    "نادي التصميم",
    "نادي القانون",
    "نادي العلوم",

  ];

  return clubs.map(

    (club) => {

      const attendance =
        Math.floor(
          Math.random() * 100
        );

      const engagement =
        Math.floor(
          Math.random() * 100
        );

      const challengeCompletion =
        Math.floor(
          Math.random() * 100
        );

      const xp =

        attendance +
        engagement +
        challengeCompletion;

      return {

        club,

        attendance,

        engagement,

        challengeCompletion,

        xp,

      };

    }

  ).sort(

    (a, b) => b.xp - a.xp

  );

}