package com.revaisor.ai_integration_backend.exception;

import org.springframework.stereotype.Component;


import java.util.regex.Pattern;

@Component
public class RequestValidator {

    private static final Pattern UNSAFE_PATTERN = Pattern.compile("(?i)(<script|javascript:|onclick|onerror|eval\\(|document\\.cookie)");

    private static final int MAX_LENGTH = 2000;


    public String verification(String request) {
        if(request == null || request.isEmpty() || request.isBlank()) {
            return "Invalid request, message is null or empty";
        }


        if(request.length() > MAX_LENGTH) {
            return "Invalid request, message is too long, you can only use %d characters".formatted(MAX_LENGTH);
        }

        if(UNSAFE_PATTERN.matcher(request.toLowerCase()).find()) {
            return "Invalid request, message contains unsafe content";
        }

        return "valid request";
    }

    public String sanitize(String message){
        if(message == null) {
            return null;
        }

        String sanitizedMessage = message.replaceAll("<[^>]*>", "");

        sanitizedMessage = sanitizedMessage.replaceAll("[^\\p{L}\\p{N}\\s]", "");

        sanitizedMessage = sanitizedMessage.replaceAll("\\s+", " ");

        return sanitizedMessage.trim();
    }

}
