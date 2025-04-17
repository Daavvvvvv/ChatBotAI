package com.revaisor.ai_integration_backend.controller;

import com.revaisor.ai_integration_backend.dto.MessageRequest;
import com.revaisor.ai_integration_backend.dto.MessageResponse;
import com.revaisor.ai_integration_backend.service.AiService;
import com.revaisor.ai_integration_backend.service.impl.OpenAI.OpenAIService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final Map<String, AiService> aiServices;


    public AiController(
            @Qualifier("QwenAiService") AiService qwenAiService,
            @Qualifier("DeepseekAiService") AiService deepseekAiService,
            @Qualifier("Gpt4oService") AiService gpt4oAiService,
            @Qualifier("Gpt3Service") AiService gpt3AiService
    ){
        this.aiServices = Map.of(
                "qwen", qwenAiService,
                "deepseek", deepseekAiService,
                "gpt4o", gpt4oAiService,
                "gpt3.5", gpt3AiService
        );
    }

    /**
     * Endpoint for generate response from AI model
     * @param request MessageRequest object containing the message
     * @return ResponseEntity containing the generated response
     */

    @PostMapping("/generate")
    public MessageResponse generateResponse(@RequestBody MessageRequest request){
        String modelType = request.getModelType() != null ? request.getModelType().toLowerCase() : "gpt4o";

        String assistantType = request.getAssistantType() != null ? request.getAssistantType().toLowerCase() : "math";

        AiService service = aiServices.getOrDefault(modelType, aiServices.get("gpt4o"));


        String response = service.generateResponse(request.getMessage(), assistantType);

        return new MessageResponse(response);
    }

    @GetMapping("/models")
    public Map<String, String> getModels() {
        return Map.of(
                "qwen", "Qwen2.5 model 3b",
                "deepseek", "Deepseekr1-7b model",
                "gpt4o", "Gpt-4o model",
                "gpt3.5", "Gpt-3.5 model"
        );
    }

}
