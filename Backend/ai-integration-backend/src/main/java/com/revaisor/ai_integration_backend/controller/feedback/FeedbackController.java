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

    /**
     * Endpoint to submit feedback
     *
     * @param request FeedbackRequest containing the feedback details
     * @return ResponseEntity with the saved Feedback object and HTTP status
     */

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@RequestBody FeedbackRequest request){
        Feedback savedFeedback = feedbackService.saveFeedback(request);
        return new ResponseEntity<>(savedFeedback, HttpStatus.CREATED);
    }


    /**
     * Endpoint to get all feedback
     *
     * @return ResponseEntity with a list of Feedback objects and HTTP status
     */
    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        List<Feedback> feedbackList = feedbackService.getAllFeedback();
        return new ResponseEntity<>(feedbackList, HttpStatus.OK);
    }


    /**
     * Endpoint to get feedback by ID
     *
     * @param id ID of the feedback
     * @return ResponseEntity with the Feedback object and HTTP status
     */
    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id){
        Optional<Feedback> feedback = feedbackService.getFeedbackById(id);
        return feedback
                .map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    /**
     * Endpoint to get feedback by model type
     *
     * @param modelType Model type of the feedback
     * @return ResponseEntity with a list of Feedback objects and HTTP status
     */
    @GetMapping("/model/{modelType}")
    public ResponseEntity<List<Feedback>> getFeedbackByModelType(@PathVariable String modelType) {
        List<Feedback> feedbackList = feedbackService.getFeedbackByModelType(modelType);
        return new ResponseEntity<>(feedbackList, HttpStatus.OK);
    }


    /**
     * Endpoint to get feedback by assistant type
     *
     * @param assistantType Assistant type of the feedback
     * @return ResponseEntity with a list of Feedback objects and HTTP status
     */
    @GetMapping("/assistant/{assistantType}")
    public ResponseEntity<List<Feedback>> getFeedbackByAssistantType(@PathVariable String assistantType) {
        List<Feedback> feedbackList = feedbackService.getFeedbackByAssistantType(assistantType);
        return new ResponseEntity<>(feedbackList, HttpStatus.OK);
    }


    /**
     * Endpoint to get feedback by rating
     *
     * @param rating Rating of the feedback
     * @return ResponseEntity with a list of Feedback objects and HTTP status
     */
    @GetMapping("/rating/{rating}")
    public ResponseEntity<List<Feedback>> getFeedbackByRating(@PathVariable Integer rating) {
        List<Feedback> feedbackList = feedbackService.getFeedbackByRating(rating);
        return new ResponseEntity<>(feedbackList, HttpStatus.OK);
    }


}
