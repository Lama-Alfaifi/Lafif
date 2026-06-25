import OpenAI
from "openai";

const openai =
  new OpenAI({

    apiKey:
    process.env.OPENAI_API_KEY,

  });

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const {

      club,

      category,

    } = body;

    const prompt = `

أنت AI ذكي داخل منصة جامعية.

قم بإنشاء تحدي أسبوعي مناسب للنادي التالي:

اسم النادي:
${club}

التصنيف:
${category}

أعطني:

1- عنوان التحدي
2- وصف التحدي
3- نوع التحدي
4- مستوى الصعوبة
5- عدد النقاط XP
6- مدة التحدي
7- الموعد النهائي

أجب بصيغة JSON فقط بالشكل التالي:

{
  "title": "",
  "description": "",
  "challengeType": "",
  "difficulty": "",
  "points": 0,
  "duration": "",
  "deadline": ""
}

`;

    const completion =
      await openai.chat.completions.create({

        model:
        "gpt-4o-mini",

        messages: [

          {
            role: "system",

            content:
            "أنت AI متخصص في إنشاء تحديات جامعية ذكية.",

          },

          {
            role: "user",

            content:
            prompt,

          },

        ],

        temperature:
        0.8,

      });

    const response =

      completion
      .choices[0]
      .message
      .content;

    return Response.json({

      success:
      true,

      data:
      response,

    });

  }

  catch (error) {

    console.log(error);

    return Response.json({

      success:
      false,

      message:
      "AI Error",

    });

  }

}