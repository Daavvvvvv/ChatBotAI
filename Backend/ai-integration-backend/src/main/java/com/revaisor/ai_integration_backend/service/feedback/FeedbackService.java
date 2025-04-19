package com.revaisor.ai_integration_backend.service.feedback;

import com.revaisor.ai_integration_backend.dto.FeedbackRequest;
import com.revaisor.ai_integration_backend.entity.Feedback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    @Autowired
    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public Feedback saveFeedback(FeedbackRequest request){
        Feedback feedback = new Feedback();
        feedback.setUserMessage(request.getUserMessage());
        feedback.setAiResponse(request.getAiResponse());
        feedback.setModelType(request.getModelType());
        feedback.setAssistantType(request.getAssistantType());
        feedback.setRating(request.getRating());
        feedback.setComments(request.getComments());

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }

    public List<Feedback> getFeedbackByModelType(String userId) {
        return feedbackRepository.findByModelType(userId);
    }

    public List<Feedback> getFeedbackByAssistantType(String assistantType) {
        return feedbackRepository.findByAssistantType(assistantType);
    }

    public List<Feedback> getFeedbackByRating(Integer rating) {
        return feedbackRepository.findByRating(rating);
    }

}
