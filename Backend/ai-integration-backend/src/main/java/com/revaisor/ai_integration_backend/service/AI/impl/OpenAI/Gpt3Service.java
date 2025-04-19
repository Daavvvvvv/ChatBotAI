package com.revaisor.ai_integration_backend.service.AI.impl.OpenAI;

import org.springframework.ai.model.openai.autoconfigure.OpenAiChatProperties;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.stereotype.Service;

@Service("Gpt3Service")
public class Gpt3Service extends OpenAIService{


    private static final String MODEL_NAME = "gpt-3.5-turbo";


    public Gpt3Service(OpenAiChatModel chatModel, OpenAiChatProperties properties) {
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
        return "ChatGPT-3.5 Model";
    }
}
