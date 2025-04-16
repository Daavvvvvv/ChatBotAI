package com.revaisor.ai_integration_backend.service.impl;


import com.revaisor.ai_integration_backend.service.AiService;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.stereotype.Service;

@Service("OllamaAiService")
public abstract class OllamaAiService implements AiService {

    protected final OllamaChatModel chatModel;

    public OllamaAiService(OllamaChatModel chatModel) {
        this.chatModel = chatModel;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String generateResponse(String message) {
        return generateResponse(message, getModelName());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String generateResponse(String message, String modelName) {

        try {
            OllamaOptions options = OllamaOptions.builder()
                    .model(modelName)
                    .temperature(getTemperature())
                    .build();

            return chatModel.call(new Prompt(message, options))
                    .getResult()
                    .getOutput()
                    .getText();
        }catch (Exception e) {
            throw new RuntimeException("Error generating response with " + getServiceName(), e);
        }
    }

    protected abstract String getModelName();
    protected abstract double getTemperature();
    protected abstract String getServiceName();

}
