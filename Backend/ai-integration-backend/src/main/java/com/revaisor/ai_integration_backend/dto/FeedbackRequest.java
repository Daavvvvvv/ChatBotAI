package com.revaisor.ai_integration_backend.dto;

import lombok.Data;

@Data
public class FeedbackRequest {

    private String userMessage;
    private String aiResponse;
    private String modelType;
    private String assistantType;
    private Integer rating;
    private String comments;

}
