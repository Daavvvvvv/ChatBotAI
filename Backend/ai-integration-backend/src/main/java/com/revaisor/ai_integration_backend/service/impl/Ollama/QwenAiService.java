package com.revaisor.ai_integration_backend.service.impl.Ollama;

import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.stereotype.Service;

@Service("QwenAiService")
public class QwenAiService extends OllamaAiService {

    public QwenAiService(OllamaChatModel chatModel) {
        super(chatModel);
    }

    @Override
    protected String getModelName() {
        return "qwen2.5:3b";
    }

    @Override
    protected double getTemperature() {
        return 0.9;
    }

    @Override
    protected String getServiceName() {
        return "Qwen2.5 Model";
    }
}
