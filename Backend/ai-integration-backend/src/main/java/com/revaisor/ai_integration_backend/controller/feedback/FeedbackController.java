package com.revaisor.ai_integration_backend.controller.feedback;


import com.revaisor.ai_integration_backend.dto.FeedbackRequest;
import com.revaisor.ai_integration_backend.entity.Feedback;
import com.revaisor.ai_integration_backend.service.feedback.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @Autowired
    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@RequestBody FeedbackRequest request){
        Feedback savedFeedback = feedbackService.saveFeedback(request);
        return new ResponseEntity<>(savedFeedback, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        List<Feedback> feedbackList = feedbackService.getAllFeedback();
        return new ResponseEntity<>(feedbackList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id){
        Optional<Feedback> feedback = feedbackService.getFeedbackById(id);
        return feedback
                .map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/model/{modelType}")
    public ResponseEntity<List<Feedback>> getFeedbackByModelType(@PathVariable String modelType) {
        List<Feedback> feedbackList = feedbackService.getFeedbackByModelType(modelType);
        return new ResponseEntity<>(feedbackList, HttpStatus.OK);
    }

    @GetMapping("/assistant/{assistantType}")
    public ResponseEntity<List<Feedback>> getFeedbackByAssistantType(@PathVariable String assistantType) {
        List<Feedback> feedbackList = feedbackService.getFeedbackByAssistantType(assistantType);
        return new ResponseEntity<>(feedbackList, HttpStatus.OK);
    }

    @GetMapping("/rating/{rating}")
    public ResponseEntity<List<Feedback>> getFeedbackByRating(@PathVariable Integer rating) {
        List<Feedback> feedbackList = feedbackService.getFeedbackByRating(rating);
        return new ResponseEntity<>(feedbackList, HttpStatus.OK);
    }


}
