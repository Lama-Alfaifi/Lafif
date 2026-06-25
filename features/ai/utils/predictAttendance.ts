export default function
predictAttendance({

  previousAttendance,

  engagement,

  growth,

}: {

  previousAttendance: number;

  engagement: number;

  growth: number;

}) {

  const predictedAttendance = Math.round(

    previousAttendance *
    (1 + growth / 100) *
    (engagement / 100)

  );

  const successRate = Math.min(

    100,

    Math.round(
      engagement * 0.7 +
      growth * 0.3
    )

  );

  return {

    predictedAttendance,

    successRate,

  };

}