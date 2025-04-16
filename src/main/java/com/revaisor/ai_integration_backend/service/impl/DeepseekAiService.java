package com.revaisor.ai_integration_backend.service.impl;

import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.stereotype.Service;

@Service("DeepseekAiService")
public class DeepseekAiService extends OllamaAiService {


    public DeepseekAiService(OllamaChatModel chatModel) {
        super(chatModel);
    }

    @Override
    protected String getModelName() {
        return "deepseek-r1:7b";
    }

    @Override
    protected double getTemperature() {
        return 0.5;
    }

    @Override
    protected String getServiceName() {
        return "Deepseek Model";
    }
}
