package com.revaisor.ai_integration_backend.service.impl.Ollama;


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
public abstract class OllamaAiService implements AiService {

    protected final OllamaChatModel chatModel;

    private Map<String, Resource> promptResources;

    @Value("classpath:prompts/Math-Assistant.st")
    private Resource mathAssistantPrompt;

    @Value("classpath:prompts/Software-Assistant.st")
    private Resource softwareEngineerPrompt;

    @Value("classpath:prompts/Car-Assistant.st")
    private Resource carAssistantPrompt;

    @Value("classpath:prompts/Sports-Assistant.st")
    private Resource sportsAssistantPrompt;

    @Value("classpath:prompts/Travel-Assistant.st")
    private Resource travelAssistantPrompt;

    private final ThreadLocal<String> currentAssistantType = ThreadLocal.withInitial(() -> "math");

    public OllamaAiService(OllamaChatModel chatModel) {
        this.chatModel = chatModel;
    }

    private void initializePromptResources() {
        if (promptResources == null) {
            promptResources = Map.of(
                    "math", mathAssistantPrompt,
                    "software", softwareEngineerPrompt,
                    "car", carAssistantPrompt,
                    "sports", sportsAssistantPrompt,
                    "travel", travelAssistantPrompt
            );
        }
    }



    /**
     * {@inheritDoc}
     */
    @Override
    public String generateResponse(String message) {
        String assistantType = currentAssistantType.get();

        Resource promptResource = promptResources.get(assistantType);

        if (promptResource == null) {
            promptResource = promptResources.get("math");
        }

        return generateAssistant(message, promptResource);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String generateResponse(String message, String assistantType) {
        initializePromptResources();

        Resource promptResource = promptResources.getOrDefault(
                assistantType.toLowerCase(),
                mathAssistantPrompt
        );

        return generateAssistant(message, promptResource);
    }

    private String generateAssistant(String message, Resource promptResource){
        try {
            String promptContent = new String(promptResource.getInputStream().readAllBytes());

            List<Message> messages = new ArrayList<>();
            messages.add(new SystemMessage(promptContent));
            messages.add(new UserMessage(message));

            OllamaOptions options = OllamaOptions.builder()
                    .model(getModelName())
                    .temperature(getTemperature())
                    .build();

            Prompt prompt = new Prompt(messages, options);

            return chatModel.call(prompt)
                    .getResult()
                    .getOutput()
                    .getText();

        }catch (Exception e){
            throw new RuntimeException("Error generating response" + getServiceName(), e );
        }
    }

    protected abstract String getModelName();
    protected abstract double getTemperature();
    protected abstract String getServiceName();

}
