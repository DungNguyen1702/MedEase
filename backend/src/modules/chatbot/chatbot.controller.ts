import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get('/question/:message')
  getHello(@Param('message') message: string) {
    return this.chatbotService.getMessage(message);
  }

  @Get('/translate/:message')
  getTranslate(@Param('message') message: string) {
    return this.chatbotService.translateToEnglish(message);
  }

  @Get('/ask')
  async ask(@Query('q') question: string) {
    return this.chatbotService.answer(question);
  }
}
