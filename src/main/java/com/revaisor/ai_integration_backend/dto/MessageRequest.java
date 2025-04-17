package com.revaisor.ai_integration_backend.dto;

import lombok.Getter;

@Getter
public class MessageRequest {
    private String message;
    private String modelType;
    private String assistantType;

}
