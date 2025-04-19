"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ChatMessageList } from "./ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleAvatar,
} from "./ui/chat/chat-bubble";
import { Loader2, AlertTriangle } from "lucide-react";
import { ThemeToggle } from "./themes/theme-toggle";

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

const TIMEOUT_DURATION = 60000; // 60 segundos (1 minuto)

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

// Message type definition for the chat
interface Message {
  role: "user" | "assistant" | "error";
  content: string;
}

export default function ChatComponent() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [models, setModels] = useState<ModelInfo>({});
  const [selectedModel, setSelectedModel] = useState<string>("deepseek");
  const [assistantType, setAssistantType] = useState<string>("software");
  const [requestInProgress, setRequestInProgress] = useState<boolean>(false);

  // Fetch available models when component mounts
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const modelData = await aiApi.getModels();
        setModels(modelData);
        console.log("Models fetched:", modelData);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };

    fetchModels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || requestInProgress) return;

    // Add user message to chat
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Store input before clearing it
    const currentInput = input;

    // Clear input
    setInput("");

    // Show loading state
    setLoading(true);
    setRequestInProgress(true);

    try {
      // Prepare request
      const request: MessageRequest = {
        message: currentInput,
        modelType: selectedModel,
        assistantType: assistantType,
      };

      console.log("Sending request:", request);

      // Call API
      const response = await aiApi.generateResponse(request);
      console.log("Received response:", response);

      // Add AI response to chat
      const aiMessage: Message = {
        role: "assistant",
        content: response.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating response:", error);

      // Add appropriate error message depending on the error type
      const errorMessage: Message = {
        role: "error",
        content:
          error instanceof Error && error.message.includes("tardado demasiado")
            ? "La solicitud ha tardado demasiado tiempo. Por favor, inténtalo de nuevo con un mensaje más corto o prueba con otro modelo."
            : "Lo siento, hubo un error al generar una respuesta. Por favor, intenta de nuevo.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setRequestInProgress(false);
    }
  };

  const assistantTypes = [
    { value: "software", label: "Software Engineering" },
    { value: "math", label: "Mathematics" },
    { value: "car", label: "Car Expert" },
    { value: "sports", label: "Sports" },
    { value: "travel", label: "Travel" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">
              RevAIsor AI Assistant
            </CardTitle>
            <ThemeToggle />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="flex-1 min-w-48">
              <p className="text-sm text-muted-foreground mb-1">Model</p>
              <Select
                value={selectedModel}
                onValueChange={setSelectedModel}
                disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(models).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-48">
              <p className="text-sm text-muted-foreground mb-1">
                Assistant Type
              </p>
              <Select
                value={assistantType}
                onValueChange={setAssistantType}
                disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assistant type" />
                </SelectTrigger>
                <SelectContent>
                  {assistantTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-[400px] border rounded-md">
            <ChatMessageList>
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Envía un mensaje para iniciar la conversación
                </div>
              ) : (
                messages.map((message, index) => (
                  <ChatBubble
                    key={index}
                    variant={message.role === "user" ? "sent" : "received"}>
                    <ChatBubbleAvatar
                      fallback={
                        message.role === "user"
                          ? "US"
                          : message.role === "error"
                          ? "!"
                          : "AI"
                      }
                    />
                    <ChatBubbleMessage
                      variant={message.role === "user" ? "sent" : "received"}>
                      {message.role === "error" ? (
                        <div className="flex items-start">
                          <AlertTriangle className="mr-2 h-4 w-4 text-destructive shrink-0 mt-1" />
                          <span>{message.content}</span>
                        </div>
                      ) : (
                        message.content
                      )}
                    </ChatBubbleMessage>
                  </ChatBubble>
                ))
              )}
              {loading && (
                <ChatBubble variant="received">
                  <ChatBubbleAvatar fallback="AI" />
                  <ChatBubbleMessage variant="received">
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando respuesta...
                    </div>
                  </ChatBubbleMessage>
                </ChatBubble>
              )}
            </ChatMessageList>
          </div>
        </CardContent>

        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                loading
                  ? "Espera a que termine la respuesta actual..."
                  : "Escribe tu mensaje aquí..."
              }
              className="flex-1 resize-none"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !loading) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Enviar"
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
