import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import PageHeader from "./PageHeader";
import EmptyState from "./EmptyState";
import { Mic, MicOff, Send, MessageSquare, Loader2, XCircle } from "lucide-react";
import type { Message } from "@shared/schema";
import { useState, useRef, useEffect } from "react";
import { analytics } from "@/lib/posthog";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage?: (content: string) => void;
  isListening?: boolean;
  onToggleListening?: () => void;
  isLoading?: boolean;
  className?: string;
  onEndAdventure?: () => void;
}

// Helper function to parse message content and extract options
function parseMessageContent(content: string): { text: string; options: string[] } {
  const lines = content.split('\n');
  const options: string[] = [];
  let text = '';
  let inOptions = false;

  for (const line of lines) {
    // Check if line starts with bullet point (•, -, or *)
    if (line.trim().match(/^[•\-\*]\s+/)) {
      inOptions = true;
      options.push(line.trim().replace(/^[•\-\*]\s+/, ''));
    } else if (line.trim().toLowerCase().includes('what do you do')) {
      inOptions = true;
      // Don't add this line to text or options
    } else if (!inOptions) {
      text += line + '\n';
    }
  }

  return { text: text.trim(), options };
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isListening = false,
  onToggleListening,
  isLoading = false,
  className = "",
  onEndAdventure
}: ChatInterfaceProps) {
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSend = () => {
    if (inputText.trim()) {
      console.log('[ChatInterface] Send message button clicked', {
        messageLength: inputText.length
      });
      analytics.buttonClicked('Send Message', 'Chat Interface', {
        message_length: inputText.length,
        via: 'button'
      });
      analytics.messageSent('chat');
      onSendMessage?.(inputText);
      setInputText("");
    }
  };

  const handleToggleListening = () => {
    console.log('[ChatInterface] Voice toggle button clicked', {
      wasListening: isListening,
      nowListening: !isListening
    });
    analytics.buttonClicked('Toggle Voice', 'Chat Interface', {
      was_listening: isListening,
      now_listening: !isListening
    });
    onToggleListening?.();
  };
  
  const getSenderBadge = (sender: string, senderName?: string | null) => {
    switch (sender) {
      case "dm":
        return <Badge variant="secondary" className="rounded-full">Narrator</Badge>;
      case "npc":
        return <Badge variant="secondary" className="rounded-full">{senderName || "Character"}</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full">You</Badge>;
    }
  };
  
  return (
    <div className={`h-full flex flex-col ${className}`} data-testid="chat-interface">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Your Story"
          subtitle="Chat with your narrator and characters"
          action={{
            label: "End Story",
            onClick: () => {
              console.log('[ChatInterface] End Story button clicked');
              analytics.buttonClicked('End Story', 'Chat Interface');
              onEndAdventure?.();
            },
            icon: XCircle,
            variant: "destructive"
          }}
        />

        {/* Messages - flexible height */}
        <div className="flex-1 overflow-auto px-4 sm:px-6 py-4" ref={scrollRef}>
          <div className="space-y-3 sm:space-y-4">
              {messages.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="No messages yet"
                  description="Start your adventure by speaking or using quick actions!"
                />
              ) : (
                messages.map((message) => {
                  const { text, options } = parseMessageContent(message.content);
                  const isPlayer = message.sender === "player";

                  return (
                    <div key={message.id} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {getSenderBadge(message.sender, message.senderName)}
                        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      </div>
                      <div className={`p-2.5 sm:p-3 rounded-lg ${
                        isPlayer
                          ? "bg-primary/10 border-l-4 border-primary ml-2 sm:ml-4"
                          : "bg-muted/50"
                      }`}>
                        <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">{text}</p>

                        {/* Render clickable options for DM/NPC messages */}
                        {!isPlayer && options.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs sm:text-sm font-semibold text-foreground">What do you do?</p>
                            {options.map((option, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-left h-auto py-2.5 px-3 min-h-[44px]"
                                onClick={() => {
                                  console.log('[ChatInterface] Quick action option clicked', {
                                    option: option.substring(0, 50)
                                  });
                                  analytics.buttonClicked('Quick Action Option', 'Chat Interface', {
                                    option_preview: option.substring(0, 50)
                                  });
                                  analytics.messageSent('action');
                                  onSendMessage?.(option);
                                }}
                                disabled={isLoading}
                              >
                                <span className="text-sm leading-snug">{option}</span>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* AI Thinking Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-lg bg-muted/50 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm text-muted-foreground">Your narrator is thinking...</p>
                </div>
              )}
            </div>
          </div>

          {/* Text Input - Sticky at bottom on mobile */}
          <div className="border-t border-border p-3 sm:p-4 bg-card">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant={isListening ? "destructive" : "secondary"}
                onClick={handleToggleListening}
                className="shrink-0 h-11 w-11"
                data-testid="button-voice-toggle"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>

              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder={isListening ? "Listening..." : "Type your message..."}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      if (inputText.trim()) {
                        console.log('[ChatInterface] Message sent via Enter key', {
                          messageLength: inputText.length
                        });
                        analytics.buttonClicked('Send Message', 'Chat Interface', {
                          message_length: inputText.length,
                          via: 'enter_key'
                        });
                        analytics.messageSent('chat');
                      }
                      handleSend();
                    }
                  }}
                  className="flex-1 px-3 py-2.5 bg-muted rounded-md text-sm sm:text-base text-foreground placeholder:text-muted-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                  disabled={isListening || isLoading}
                  data-testid="input-chat-message"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!inputText.trim() || isListening || isLoading}
                  className="h-11 w-11"
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
      </Card>
    </div>
  );
}