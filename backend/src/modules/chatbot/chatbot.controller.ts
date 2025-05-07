import { Controller, Get, Param } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  // Define your controller methods here
  // For example, you can create a method to handle incoming messages
  // and interact with the chatbot service.
  // Example: @Get('message') async handleMessage(@Body() message: string) { ... }

  @Get('/question/:message')
  getHello(@Param('message') message: string) {
    return this.chatbotService.getMessage(message);
  }

  @Get('/translate/:message')
  getTranslate(@Param('message') message: string) {
    return this.chatbotService.translateToEnglish(message);
  }
}
