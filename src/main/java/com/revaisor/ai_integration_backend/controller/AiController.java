package com.revaisor.ai_integration_backend.controller;

import com.revaisor.ai_integration_backend.dto.MessageRequest;
import com.revaisor.ai_integration_backend.dto.MessageResponse;
import com.revaisor.ai_integration_backend.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    @Autowired
    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    /**
     * Endpoint for generate response from AI model
     * @param request MessageRequest object containing the message
     * @return ResponseEntity containing the generated response
     */
    @PostMapping("/chat")
    public ResponseEntity<MessageResponse> generateResponse(@RequestBody MessageRequest request){
        String response = aiService.generateResponse(request.getMessage());
        return ResponseEntity.ok(new MessageResponse(response));
    }

    /**
     * Endpoint for testing the AI service
     * @return A simple response indicating the service is working
     */
    @GetMapping("/test")
    public ResponseEntity<MessageResponse> test(){
        String response = aiService.generateResponse("Hello");
        return ResponseEntity.ok(new MessageResponse(response));
    }

}
