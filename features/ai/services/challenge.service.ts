import openai
from "./openai.service";

export default async function
challengeService(

  clubName: string,

  category: string,

) {

  const prompt = `

  أنت AI جامعي ذكي.

  أنشئ تحديًا أسبوعيًا للنادي التالي:

  اسم النادي:
  ${clubName}

  التخصص:
  ${category}

  المطلوب:
  - عنوان التحدي
  - وصف التحدي
  - مستوى الصعوبة
  - عدد النقاط

  أعد النتيجة بصيغة JSON فقط.

  `;

  const response =
    await openai.chat.completions.create({

      model:
      "gpt-4.1-mini",

      messages: [

        {
          role:
          "system",

          content:
          "أنت مولد تحديات جامعية ذكي",
        },

        {
          role:
          "user",

          content:
          prompt,
        },

      ],

    });

  return response
    .choices[0]
    .message
    .content;

}