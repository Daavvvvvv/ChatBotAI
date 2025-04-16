package com.revaisor.ai_integration_backend.service.impl.OpenAI;

import com.revaisor.ai_integration_backend.service.AiService;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.model.openai.autoconfigure.OpenAiChatProperties;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.stereotype.Service;

@Service
public abstract class OpenAIService implements AiService {

    protected final OpenAiChatModel chatModel;
    protected final OpenAiChatProperties properties;

    public OpenAIService(OpenAiChatModel chatModel, OpenAiChatProperties properties) {
        this.chatModel = chatModel;
        this.properties = properties;
    }

    @Override
    public String generateResponse(String message) {
        return generateResponse(message, getModelName());
    }

    @Override
    public String generateResponse(String message, String modelName) {
        try {
            OpenAiChatOptions options = OpenAiChatOptions.builder()
                    .model(modelName)
                    .temperature(getTemperature())
                    .build();

            return chatModel.call(new Prompt(message, options))
                    .getResult()
                    .getOutput()
                    .getText();

        } catch (Exception e) {
            throw new RuntimeException("Error generating response with " + getServiceName(), e);
        }
    }

    protected abstract String getModelName();

    protected abstract double getTemperature();

    protected abstract String getServiceName();

}
