import { Body, Controller, Post } from '@nestjs/common';
import { createChatCompletionRequest } from './dto/create-chat-completion.request';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
    constructor(private readonly geminiService: GeminiService){}
    @Post('chatCompletion')
    async createChatCompletion(
        @Body() body: createChatCompletionRequest) {
            return this.geminiService.createChatCompletion(body.messages);
        }

    
}
