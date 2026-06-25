export default function
calculateScore({

  attendance,

  engagement,

  challengeCompletion,

}: {

  attendance: number;

  engagement: number;

  challengeCompletion: number;

}) {

  let score = 0;

  score += attendance * 0.4;

  score += engagement * 0.4;

  score += challengeCompletion * 0.2;

  return Math.min(
    100,
    Math.round(score)
  );

}