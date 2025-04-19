package com.revaisor.ai_integration_backend.service.feedback;


import com.revaisor.ai_integration_backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByModelType(String modelType);

    List<Feedback> findByAssistantType(String assistantType);

    List<Feedback> findByRating(Integer rating);


}
