package com.revaisor.ai_integration_backend.service.AI.impl.OpenAI;

import com.revaisor.ai_integration_backend.service.AI.impl.AbstractAiService;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.model.openai.autoconfigure.OpenAiChatProperties;
import org.springframework.ai.openai.OpenAiChatModel;

import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public abstract class OpenAIService extends AbstractAiService {

    protected final OpenAiChatModel chatModel;
    protected final OpenAiChatProperties properties;


    public OpenAIService(OpenAiChatModel chatModel, OpenAiChatProperties properties) {
        this.chatModel = chatModel;
        this.properties = properties;
    }


    @Override
    protected String callModelWithPrompt(List<Message> messages) {

        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .model(getModelName())
                .temperature(getTemperature())
                .build();

        Prompt prompt = new Prompt(messages, options);

        return chatModel.call(prompt)
                .getResult()
                .getOutput()
                .getText();

    }
}
