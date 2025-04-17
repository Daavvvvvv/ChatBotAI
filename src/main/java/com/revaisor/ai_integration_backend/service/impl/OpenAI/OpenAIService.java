package com.revaisor.ai_integration_backend.service.impl.OpenAI;

import com.revaisor.ai_integration_backend.service.AiService;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.core.io.Resource;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.model.openai.autoconfigure.OpenAiChatProperties;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public abstract class OpenAIService implements AiService {

    protected final OpenAiChatModel chatModel;
    protected final OpenAiChatProperties properties;

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

    public OpenAIService(OpenAiChatModel chatModel, OpenAiChatProperties properties) {
        this.chatModel = chatModel;
        this.properties = properties;
    }


    private void initializePromptResources(){
        if(promptResources == null){
            promptResources = new HashMap<>();
            promptResources.put("math", mathAssistantPrompt);
            promptResources.put("software", softwareEngineerPrompt);
            promptResources.put("car", carAssistantPrompt);
            promptResources.put("sports", sportsAssistantPrompt);
            promptResources.put("travel", travelAssistantPrompt);
        }
    }

    @Override
    public String generateResponse(String message) {
        String assistantType = currentAssistantType.get();

        Resource promptResource = promptResources.get(assistantType);

        if(promptResource == null) {
            promptResource = promptResources.get("math");
        }

        return generateAssistant(message, promptResource);
    }

    public String generateResponse(String message, String assistantType){
        initializePromptResources();

        Resource promptResource = promptResources.getOrDefault(
                assistantType.toLowerCase(),
                mathAssistantPrompt
        );

        return generateAssistant(message, promptResource);
    }


    public String generateAssistant(String message, Resource promptResource) {
        try {
            String promptContent = new String(promptResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            List<Message> messages = new ArrayList<>();
            messages.add(new SystemMessage(promptContent));
            messages.add(new UserMessage(message));

            OpenAiChatOptions options = OpenAiChatOptions.builder()
                    .model(getModelName())
                    .temperature(getTemperature())
                    .build();

            Prompt prompt = new Prompt(messages, options);

            return chatModel.call(prompt)
                    .getResult()
                    .getOutput()
                    .getText();


        } catch (Exception e) {
            throw new RuntimeException("Error generating response with " + getServiceName(), e);
        }
    }

    protected abstract String getModelName();

    protected abstract double getTemperature();

    protected abstract String getServiceName();

}
