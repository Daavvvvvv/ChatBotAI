"use client";

import { useState, useEffect } from "react";
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
  ChatBubbleAction,
  ChatBubbleActionWrapper,
} from "./ui/chat/chat-bubble";
import { Loader2, AlertTriangle, Star } from "lucide-react";
import { ThemeToggle } from "./themes/theme-toggle";
import { aiApi, type MessageRequest } from "@/lib/api";
import { FeedbackComponent } from "./FeedbackComponent";
import { feedbackApi, type FeedbackRequest } from "@/lib/feedbackApi";


// Message type definition for the chat
interface Message {
  role: "user" | "assistant" | "error";
  content: string;
  id?: number;
}

/**
 * 
 * @returns ChatComponent - A chat component that allows users to interact with an AI assistant.
 * It includes a message input area, a model selection dropdown, and a feedback system for AI responses. 
 */

export default function ChatComponent() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [models, setModels] = useState<Record<string, string>>({});
  const [selectedModel, setSelectedModel] = useState<string>("deepseek");
  const [assistantType, setAssistantType] = useState<string>("software");
  const [requestInProgress, setRequestInProgress] = useState<boolean>(false);

  // Feedback state
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackMessageIndex, setFeedbackMessageIndex] = useState<
    number | null
  >(null);

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
        id: Date.now(), // Add a unique ID for the message
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating response:", error);

      // Handle error message
      const errorMessage: Message = {
        role: "error",
        content:
          error instanceof Error && error.message.includes("took too long")
            ? "The request took too long to complete. Please try again with a shorter message or try a different model."
            : "Sorry, there was an error generating a response. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setRequestInProgress(false);
    }
  };


  /**
   * 
   * @param index - The index of the assistant message to rate.
   * Sets the feedback message index and shows the feedback dialog.
   */
  const handleFeedbackClick = (index: number) => {
    setFeedbackMessageIndex(index);
    setShowFeedback(true);
  };


  /**
   * 
   * @param rating - The rating given by the user.
   * @param comments - Additional comments provided by the user.
   * Submits the feedback for the selected assistant message.
   */
  const handleFeedbackSubmit = async (rating: number, comments: string) => {
    if (feedbackMessageIndex === null) return;

    // Get the assistant message to rate
    const assistantMessage = messages[feedbackMessageIndex];

    // Get the user message that prompted this response (should be right before the assistant response)
    const userMessageIndex = feedbackMessageIndex - 1;
    const userMessage =
      userMessageIndex >= 0 ? messages[userMessageIndex] : { content: "" };

    // Prepare the feedback request
    const feedbackRequest: FeedbackRequest = {
      userMessage: userMessage.content,
      aiResponse: assistantMessage.content,
      modelType: selectedModel,
      assistantType: assistantType,
      rating: rating,
      comments: comments || undefined,
    };

    // Submit the feedback
    await feedbackApi.submitFeedback(feedbackRequest);

    // Reset feedback state
    setShowFeedback(false);
    setFeedbackMessageIndex(null);
  };


  // Assistant types for the dropdown
  const assistantTypes = [
    { value: "software", label: "Software Engineer" },
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
                  Send a message to start the conversation
                </div>
              ) : (
                messages.map((message, index) => (
                  <ChatBubble
                    key={message.id || index}
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
                    {message.role === "assistant" && (
                      <ChatBubbleActionWrapper variant="received">
                        <ChatBubbleAction
                          icon={<Star className="h-4 w-4" />}
                          onClick={() => handleFeedbackClick(index)}
                          aria-label="Rate this response"
                          title="Rate this response"
                        />
                      </ChatBubbleActionWrapper>
                    )}
                  </ChatBubble>
                ))
              )}
              {loading && (
                <ChatBubble variant="received">
                  <ChatBubbleAvatar fallback="AI" />
                  <ChatBubbleMessage variant="received">
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating response...
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
                  ? "Wait for the current response to finish..."
                  : "Type your message here..."
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
                "Send"
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>

      {feedbackMessageIndex !== null && (
        <FeedbackComponent
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          userMessage={
            feedbackMessageIndex > 0
              ? messages[feedbackMessageIndex - 1].content
              : ""
          }
          aiResponse={messages[feedbackMessageIndex]?.content || ""}
          modelType={selectedModel}
          assistantType={assistantType}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
}
