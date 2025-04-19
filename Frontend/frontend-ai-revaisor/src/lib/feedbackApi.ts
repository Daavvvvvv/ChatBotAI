// src/lib/feedbackApi.ts

import { API_BASE_URL } from "./api";

export interface FeedbackRequest {
  userMessage: string;
  aiResponse: string;
  modelType: string;
  assistantType: string;
  rating: number;
  comments?: string;
}

export interface FeedbackResponse {
  id: number;
  userMessage: string;
  aiResponse: string;
  modelType: string;
  assistantType: string;
  rating: number;
  comments: string;
  createdAt: string;
}

export const feedbackApi = {
  async submitFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
    try {
      // Get the API base URL without the "/ai" path
      const baseUrl = API_BASE_URL.replace(/\/ai$/, "");

      const response = await fetch(`${baseUrl}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw error;
    }
  },

  async getFeedback(): Promise<FeedbackResponse[]> {
    try {
      // Get the API base URL without the "/ai" path
      const baseUrl = API_BASE_URL.replace(/\/ai$/, "");

      const response = await fetch(`${baseUrl}/feedback`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching feedback:", error);
      throw error;
    }
  },
};
