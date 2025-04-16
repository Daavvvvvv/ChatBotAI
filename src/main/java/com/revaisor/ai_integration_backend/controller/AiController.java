package com.revaisor.ai_integration_backend.controller;

import com.revaisor.ai_integration_backend.dto.MessageRequest;
import com.revaisor.ai_integration_backend.dto.MessageResponse;
import com.revaisor.ai_integration_backend.service.AiService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final Map<String, AiService> aiServices;

    public AiController(
            @Qualifier("QwenAiService") AiService qwenAiService,
            @Qualifier("DeepseekAiService") AiService deepseekAiService
    ){
        this.aiServices = Map.of(
                "qwen", qwenAiService,
                "deepseek", deepseekAiService
        );
    }

    /**
     * Endpoint for generate response from AI model
     * @param request MessageRequest object containing the message
     * @return ResponseEntity containing the generated response
     */

    @PostMapping("/generate")
    public MessageResponse generateResponse(@RequestBody MessageRequest request){
        String modelType = request.getModelType() != null ? request.getModelType() : "qwen";

        AiService service = aiServices.getOrDefault(modelType, aiServices.get("qwen"));

        String response = service.generateResponse(request.getMessage());

        return new MessageResponse(response);
    }

    @GetMapping("/models")
    public Map<String, String> getModels() {
        return Map.of(
                "qwen", "Qwen2.5 model 3b",
                "deepseek", "Deepseekr1-7b model"
        );
    }

}
