import { type Part } from '@genkit-ai/googleai'; // Assuming Part is exported, or we'll define a similar structure

// Define the structure for a single part of a message's content
// This aligns with Genkit's expectation for multimodal input.
export interface GenkitMessageContentPart {
  text?: string;
  media?: {
    url: string; // For data URIs or publicly accessible URLs
    contentType?: string; // Optional, but good for clarity, e.g., 'image/jpeg'
  };
  // We can extend this to other types of content if needed, e.g., tool calls
}

// Define the structure for a single message in the history
export interface GenkitMessage {
  role: 'user' | 'model' | 'system' | 'tool'; // System and tool roles might be useful later
  content: GenkitMessageContentPart[];
}

// Define the type for the chat history array
export type ChatHistory = GenkitMessage[];

// Re-exporting the Message type from ChatInterface for easier import paths if needed elsewhere,
// or to eventually consolidate if they become very similar.
// For now, we keep them distinct as ChatInterface.Message has UI-specific fields.

// Example of how a Google AI Part might look, to ensure compatibility if not directly importing
// If @genkit-ai/googleai doesn't export Part, we can use this as a fallback definition.
export interface GoogleAIPart {
    text?: string;
    inlineData?: {
        mimeType: string;
        data: string; // Base64 encoded string
    };
    // fileData?: { TODO: if we need to support file URIs directly
    //   mimeType: string;
    //   fileUri: string;
    // };

}

// This type can be used in the AI flows to represent the history specifically for the model
export interface ModelChatMessage {
  role: 'user' | 'model'; // Models typically only understand 'user' and 'model' roles in history
  parts: GoogleAIPart[];

}
export type ModelChatHistory = ModelChatMessage[];
