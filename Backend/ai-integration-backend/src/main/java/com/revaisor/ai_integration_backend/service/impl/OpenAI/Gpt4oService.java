package com.revaisor.ai_integration_backend.service.impl.OpenAI;

import org.springframework.ai.model.openai.autoconfigure.OpenAiChatProperties;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.stereotype.Service;

@Service("Gpt4oService")
public class Gpt4oService extends OpenAIService{

    private static final String MODEL_NAME = "gpt-4o";

    public Gpt4oService(OpenAiChatModel chatModel, OpenAiChatProperties properties) {
        super(chatModel, properties);
    }

    @Override
    protected String getModelName() {
        return MODEL_NAME;
    }

    @Override
    protected double getTemperature() {
        return 0.7;
    }

    @Override
    protected String getServiceName() {
        return "ChatGPT-4o Model";
    }
}
