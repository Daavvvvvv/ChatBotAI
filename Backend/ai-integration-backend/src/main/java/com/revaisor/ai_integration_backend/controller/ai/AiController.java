package com.revaisor.ai_integration_backend.controller.ai;

import com.revaisor.ai_integration_backend.dto.MessageRequest;
import com.revaisor.ai_integration_backend.dto.MessageResponse;
import com.revaisor.ai_integration_backend.service.AI.impl.AiService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final Map<String, AiService> aiServices;


    /**
     * Constructor for AiController
     *
     * @param qwenAiService    Qwen AI service
     * @param deepseekAiService Deepseek AI service
     * @param gpt4oAiService   Gpt-4o AI service
     * @param gpt3AiService    Gpt-3.5 AI service
     */
    public AiController(
            @Qualifier("QwenAiService") AiService qwenAiService,
            @Qualifier("DeepseekAiService") AiService deepseekAiService,
            @Qualifier("Gpt4oService") AiService gpt4oAiService,
            @Qualifier("Gpt3Service") AiService gpt3AiService
    ) {
        this.aiServices = Map.of(
                "qwen", qwenAiService,
                "deepseek", deepseekAiService,
                "gpt4o", gpt4oAiService,
                "gpt3.5", gpt3AiService
        );
    }

    /**
     * Endpoint for generate response from AI model
     *
     * @param request MessageRequest containing the message and model type
     * @return MessageResponse containing the generated response
     */

    @PostMapping("/generate")
    public MessageResponse generateResponse(@RequestBody MessageRequest request) {
        String modelType = request.getModelType() != null ? request.getModelType().toLowerCase() : "qwen";
        String assistantType = request.getAssistantType() != null ? request.getAssistantType().toLowerCase() : "math";
        AiService service = aiServices.get(modelType);

        String response = service.generateResponse(request.getMessage(), assistantType);

        return new MessageResponse(response);
    }

    /**
     * Endpoint to get available models
     *
     * @return Map of available models
     */
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
