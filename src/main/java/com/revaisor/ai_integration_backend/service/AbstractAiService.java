package com.revaisor.ai_integration_backend.service;

import com.revaisor.ai_integration_backend.exception.RequestValidator;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public abstract class AbstractAiService implements AiService {

    private Map<String, Resource> promptResources;

    @Autowired
    protected RequestValidator requestValidator;

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

        String validationResult = requestValidator.verification(message);
        String sanitizedMessage = sanitizeMessage(message);

        if (!validationResult.equals("valid request")) {
            return validationResult;
        }

        Resource promptResource = getPromptResources().getOrDefault(
                assistantType.toLowerCase(),
                mathAssistantPrompt
        );




        return generateAssistant(sanitizedMessage, promptResource);
    }

    private String generateAssistant(String message, Resource promptResource) {
        try {
            String promptContent = new String(promptResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            String sanitizedMessage = requestValidator.sanitize(message);

            List<Message> messages = new ArrayList<>();
            messages.add(new SystemMessage(promptContent));
            messages.add(new UserMessage(sanitizedMessage));

            return callModelWithPrompt(messages);

        } catch (Exception e) {
            throw new RuntimeException("Error generating response" + getServiceName(), e);
        }
    }

    private String sanitizeMessage(String message) {
        String validationResult = requestValidator.verification(message);
        if (!validationResult.equals("valid request")) {
            return validationResult;
        }
        return requestValidator.sanitize(message);
    }

    protected abstract String callModelWithPrompt(List<Message> messages);

    protected abstract String getModelName();

    protected abstract double getTemperature();

    protected abstract String getServiceName();

}
