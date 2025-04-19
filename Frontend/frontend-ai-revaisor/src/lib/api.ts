export interface MessageRequest {
  message: string;
  modelType: string;
  modelName: string;
}

export interface MessageResponse {
  response: string;
}

export interface ModelInfo {
  [key: string]: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/ai";

const aiApi = {
  async generateResponse(request: MessageRequest): Promise<MessageResponse> {
    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch response from API");
      }
      return await response.json();
    } catch (error) {
      console.error("Error in generateResponse:", error);
      throw error;
    }
  },

  async getModels(): Promise<ModelInfo> {
    try {
      const response = await fetch(`${API_URL}/models`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch models from API");
      }
      return await response.json();
    } catch (error) {
      console.error("Error in getModels:", error);
      throw error;
    }
  },
};

export default aiApi;
