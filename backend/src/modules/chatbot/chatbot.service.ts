import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ChatbotService {
  private readonly geminiApiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCU7FqtnTIkIT8wsoXTmLz51iPbdIjjgik';

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

      console.log('Response from Gemini API:', response.data);

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
