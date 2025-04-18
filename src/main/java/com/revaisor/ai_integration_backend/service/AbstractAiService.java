package com.revaisor.ai_integration_backend.service;

import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public abstract class AbstractAiService implements AiService {

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

    public Map<String, Resource> getPromptResources() {
        if (promptResources == null) {
            promptResources = Map.of(
                    "math", mathAssistantPrompt,
                    "software", softwareEngineerPrompt,
                    "car", carAssistantPrompt,
                    "sports", sportsAssistantPrompt,
                    "travel", travelAssistantPrompt
            );
        }
        return promptResources;
    }

    @Override
    public String generateResponse(String message, String assistantType) {
        Resource promptResource = getPromptResources().getOrDefault(
                assistantType.toLowerCase(),
                mathAssistantPrompt
        );

        return generateAssistant(message, promptResource);
    }

    private String generateAssistant(String message, Resource promptResource) {
        try{
            String promptContent = new String(promptResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            List< Message> messages = new ArrayList<>();
            messages.add(new SystemMessage(promptContent));
            messages.add(new UserMessage(message));

            return callModelWithPrompt(messages);

        }catch (Exception e){
            throw new RuntimeException("Error generating response" + getServiceName(), e);
        }
    }

    protected abstract String callModelWithPrompt(List<Message> messages);

    protected abstract String getModelName();

    protected abstract double getTemperature();

    protected abstract String getServiceName();

}
