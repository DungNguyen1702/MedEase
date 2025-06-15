import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import {
  cosineSimilarity,
  loadLocalEmbeddingModel,
} from '../../common/utils/chatbot.utils';
import { google } from 'googleapis';

@Injectable()
export class ChatbotService {
  private readonly geminiApiUrl = process.env.GEMINI_API_URL;

  private faqList: { question: string; answer: string; vector: number[] }[] =
    [];

  constructor() {
    this.loadFAQ();
  }

  async loadFAQ() {
    // Lấy credentials từ biến môi trường
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64!, 'base64').toString(
        'utf-8'
      )
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID!;
    const range = 'Sheet1!A2:C'; // Giả sử cột A: STT, B: Câu hỏi, C: Trả lời

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = res.data.values || [];
    const model = await loadLocalEmbeddingModel();

    this.faqList = await Promise.all(
      rows.map(async row => {
        const question = row[1];
        const answer = row[2];
        const vector = await model.embed(question);
        return { question, answer, vector };
      })
    );
  }

  async callGeminiAPI(prompt: string): Promise<string> {
    // console.log('Calling Gemini API with prompt:', prompt);

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const response = await axios.post(this.geminiApiUrl, requestBody, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = response.data;

    console.log('Response from Gemini API Data:', data);

    return (
      data.candidates[0].content.parts[0]?.text ||
      'Câu hỏi này vui lòng đợi phía bác sĩ hoặc bệnh viện trả lời.'
    );
  }

  async appendQuestionToSheet(
    questionId: string,
    question: string,
    embedding: number[]
  ) {
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64!, 'base64').toString(
        'utf-8'
      )
    );
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID!;
    const range = 'Sheet1!A2:D'; // Cột A: questionId, B: Câu hỏi, C: Trả lời, D: Embedding

    const row = [
      questionId,
      question,
      '', // Chưa có trả lời
      JSON.stringify(embedding),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });
  }

  async updateAnswerInSheet(questionId: string, newAnswer: string) {
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64!, 'base64').toString(
        'utf-8'
      )
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID!;

    // B1: Tìm dòng chứa questionId
    const idRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A2:A', // Chỉ cột questionId
    });

    const rows = idRes.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === questionId);
    if (rowIndex === -1) return;

    const rowNumber = rowIndex + 2; // Do bắt đầu từ dòng 2
    const answerCell = `Sheet1!C${rowNumber}`; // Cột C là "Trả lời"

    // B2: Đọc nội dung cũ trong ô C
    const existingRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: answerCell,
    });

    const oldAnswer = existingRes.data.values?.[0]?.[0] || '';

    // B3: Ghi thêm
    const updatedAnswer = oldAnswer
      ? `${oldAnswer}\n---\n${newAnswer}` // hoặc `${oldAnswer}\n${newAnswer}` nếu không cần phân cách
      : newAnswer;

    // B4: Ghi đè lại toàn bộ chuỗi mới
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: answerCell,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[updatedAnswer]],
      },
    });
  }

  async answer(userQuestion: string, questionId: string) {
    const model = await loadLocalEmbeddingModel();
    const userVec = await model.embed(userQuestion);

    let bestMatch = null;
    let bestScore = -1;

    for (const item of this.faqList) {
      const score = cosineSimilarity(userVec, item.vector);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    if (!bestMatch || bestScore < 0.6) {
      const prompt = `Bạn là trợ lý ảo trong hệ thống khám chữa bệnh MedEase. Người dùng hỏi: "${userQuestion}". Hãy trả lời một cách tự nhiên, ngắn gọn và thân thiện. Nếu không đủ dữ liệu để trả lời, hãy nói: "Câu hỏi này vui lòng đợi phía bác sĩ hoặc bệnh viện trả lời."`;
      const geminiAnswer = await this.callGeminiAPI(prompt);
      await this.appendQuestionToSheet(questionId, userQuestion, userVec);
      return {
        geminiAnswer,
        similarity: bestScore.toFixed(3),
      };
    }

    const prompt = `Bạn là trợ lý ảo trong hệ thống khám chữa bệnh MedEase. Người dùng hỏi: "${userQuestion}". Dựa trên câu hỏi gần nhất: "${bestMatch.question}" với câu trả lời: "${bestMatch.answer}", hãy viết lại câu trả lời này cho tự nhiên và dễ hiểu. Nếu không có đủ dữ liệu, trả lời: "Câu hỏi này vui lòng đợi phía bác sĩ hoặc bệnh viện trả lời."`;

    const geminiAnswer = await this.callGeminiAPI(prompt);

    return {
      matchedQuestion: bestMatch.question,
      originalAnswer: bestMatch.answer,
      geminiAnswer,
      similarity: bestScore.toFixed(3),
    };
  }

  async translateToEnglish(text: string): Promise<{ translated: string }> {
    try {
      // Xử lý nội dung đầu vào
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `Hãy dịch câu sau sang tiếng Anh: ${text}. Trả về dưới dạng JSON và có trường {translated}.`,
              },
            ],
          },
        ],
      };

      // Gửi yêu cầu POST tới API Gemini
      const response = await axios.post(this.geminiApiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // console.log('Response from Gemini API:', response.data);

      // Kiểm tra phản hồi từ API
      if (
        response.data.candidates &&
        response.data.candidates[0]?.content?.parts
      ) {
        const rawText = response.data.candidates[0].content.parts[0]?.text;

        // Trích xuất JSON từ chuỗi text
        const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          const parsedJson = JSON.parse(jsonMatch[1]);
          return { translated: parsedJson.translated };
        } else {
          throw new HttpException(
            'Không thể trích xuất JSON từ phản hồi của API Gemini.',
            HttpStatus.BAD_REQUEST
          );
        }
      } else {
        throw new HttpException(
          'Không nhận được phản hồi hợp lệ từ API Gemini.',
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error.message);
      throw new HttpException(
        'Đã xảy ra lỗi khi gọi API Gemini.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getMessage(message: string): Promise<{ message: string }> {
    try {
      const availableApis = [
        {
          method: 'GET',
          url: process.env.DEPLOY_SERVICE_LINK + '/specialization',
        },
      ];
      // Tìm API chuyên khoa
      const specializationApi = availableApis.find(
        api => api.url.includes('/specialization') && api.method === 'GET'
      );

      const functions = [];
      if (specializationApi) {
        functions.push({
          name: 'get_specializations',
          description: 'Lấy danh sách các chuyên khoa hiện có trong hệ thống.',
          parameters: {
            type: 'object',
            properties: {},
          },
        });
      }

      // Prompt chính xác và có chỉ dẫn
      const prompt = `
  Bạn là trợ lý ảo trong hệ thống khám chữa bệnh.
  Câu hỏi từ người dùng: "${message}"
  
  - Nếu bạn cần dữ liệu chuyên khoa để trả lời, hãy gọi function "get_specializations".
  - Nếu có thể trả lời trực tiếp, hãy trả lời ngay.
  - Nếu không có đủ dữ liệu, trả lời: "Câu hỏi này vui lòng đợi phía bác sĩ hoặc bệnh viện trả lời."
  `;

      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        tools:
          functions.length > 0
            ? [{ function_declarations: functions }]
            : undefined,
      };

      const response = await axios.post(this.geminiApiUrl, requestBody, {
        headers: { 'Content-Type': 'application/json' },
      });

      const candidate = response.data?.candidates?.[0];
      const toolCall = candidate?.tool_calls?.[0];

      if (toolCall?.function_call?.name === 'get_specializations') {
        try {
          const specializationResponse = await axios.get(specializationApi.url);
          const specializations = specializationResponse.data;

          const toolOutputs = [
            {
              tool_call_id: toolCall.id,
              function_response: {
                name: 'get_specializations',
                content: JSON.stringify({ specializations }),
              },
            },
          ];

          const secondRequestBody = {
            contents: [{ parts: [{ text: message }] }],
            tool_calls: [toolCall],
            tool_outputs: toolOutputs,
          };

          const secondResponse = await axios.post(
            this.geminiApiUrl,
            secondRequestBody,
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );

          const finalText =
            secondResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          return {
            message:
              finalText ||
              'Câu hỏi này vui lòng đợi phía bác sĩ hoặc bệnh viện trả lời.',
          };
        } catch (err) {
          console.error('Lỗi khi gọi API chuyên khoa:', err.message);
          return {
            message:
              'Câu hỏi này vui lòng đợi phía bác sĩ hoặc bệnh viện trả lời.',
          };
        }
      }

      // Nếu Gemini trả lời trực tiếp không qua function_call
      const rawText = candidate?.content?.parts?.[0]?.text;
      if (rawText) {
        try {
          const parsed = JSON.parse(rawText);
          return { message: parsed.message || rawText };
        } catch {
          return { message: rawText };
        }
      }

      return {
        message: 'Câu hỏi này vui lòng đợi phía bác sĩ hoặc bệnh viện trả lời.',
      };
    } catch (error) {
      console.error('Lỗi khi gọi Gemini API:', error.message);
      throw new HttpException(
        'Đã xảy ra lỗi khi tương tác với hệ thống. Vui lòng thử lại sau.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
