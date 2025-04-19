package com.revaisor.ai_integration_backend.service.AI.impl.Ollama;


import com.revaisor.ai_integration_backend.service.AI.impl.AbstractAiService;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("OllamaAiService")
public abstract class OllamaAiService extends AbstractAiService {

    protected final OllamaChatModel chatModel;


    public OllamaAiService(OllamaChatModel chatModel) {
        this.chatModel = chatModel;
    }


    @Override
    protected String callModelWithPrompt(List<Message> messages) {
        try {
            OllamaOptions options = OllamaOptions.builder()
                    .model(getModelName())
                    .temperature(getTemperature())
                    .build();

            Prompt prompt = new Prompt(messages, options);

            return chatModel.call(prompt)
                    .getResult()
                    .getOutput()
                    .getText();

        } catch (Exception e) {
            throw new RuntimeException("Error generating response" + getServiceName(), e);
        }
    }

    protected abstract String getModelName();

    protected abstract double getTemperature();

    protected abstract String getServiceName();

}
