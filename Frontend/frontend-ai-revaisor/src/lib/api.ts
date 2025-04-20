// Create API service type declarations
export interface MessageRequest {
  message: string;
  modelType?: string;
  assistantType?: string;
}

export interface MessageResponse {
  response: string;
}

export interface ModelInfo {
  [key: string]: string;
}

// API service implementation with timeout
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/ai";

const TIMEOUT_DURATION = 180000; // 180 seconds (3 minutes)

const aiApi = {
  async generateResponse(request: MessageRequest): Promise<MessageResponse> {
    try {
      console.log("Sending request to:", `${API_BASE_URL}/generate`);
      console.log("Request data:", request);

      // Crear un controlador de aborto
      const controller = new AbortController();
      const signal = controller.signal;

      // Configurar el timeout
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, TIMEOUT_DURATION);

      try {
        const response = await fetch(`${API_BASE_URL}/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
          signal, // Usar la señal del controlador de aborto
        });

        // Limpiar el timeout ya que la solicitud se completó
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error response:", errorText);
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Response data:", data);
        return data;
      } catch (error) {
        // Limpiar el timeout en caso de error
        clearTimeout(timeoutId);

        // Verificar si el error es debido al timeout
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error(
            "La solicitud ha tardado demasiado tiempo. Por favor, inténtalo de nuevo."
          );
        }
        throw error;
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw error;
    }
  },

  async getModels(): Promise<ModelInfo> {
    try {
      console.log("Fetching models from:", `${API_BASE_URL}/models`);

      const response = await fetch(`${API_BASE_URL}/models`, {
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

      const data = await response.json();
      console.log("Models data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching models:", error);
      throw error;
    }
  },
};

export { aiApi, API_BASE_URL, TIMEOUT_DURATION };
