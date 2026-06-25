import predictAttendance
from "../utils/predictAttendance";

export default function
predictionService() {

  return predictAttendance({

    previousAttendance:
    220,

    engagement:
    91,

    growth:
    14,

  });

}