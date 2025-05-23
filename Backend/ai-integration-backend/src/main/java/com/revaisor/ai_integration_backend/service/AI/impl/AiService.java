package com.revaisor.ai_integration_backend.service.AI.impl;


import org.springframework.core.io.Resource;

import java.util.Map;

/**
 * Interface for AI service operations
 * Defines the contract for generating responses from AI models
 */

public interface AiService {
    /**
     * Generates a response from the AI model
     * @param message Input message from the user
     * @return A response generated by the AI
     */
    String generateResponse(String message, String assistantType);
    Map<String, Resource> getPromptResources();

}
