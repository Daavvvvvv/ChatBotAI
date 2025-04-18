package com.revaisor.ai_integration_backend.service.impl.Ollama;


import com.revaisor.ai_integration_backend.service.AbstractAiService;
import com.revaisor.ai_integration_backend.service.AiService;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
