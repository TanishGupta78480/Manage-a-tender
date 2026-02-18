"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Sparkles, Minimize2 } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your sourcing assistant. I can help you with category performance insights, supplier information, tender management, and contract questions. What would you like to know?",
  },
]

const suggestedQuestions = [
  "Which bakery SKUs have declining margins?",
  "Show me suppliers for celebration cakes",
  "What tenders are closing this week?",
  "Compare offers for Victoria Sponge",
]

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        margin:
          "Based on the current data, 3 SKUs have declining margins: Large Victoria Sponge (-2.3%), Carrot Cake Slices (-1.8%), and Chocolate Fudge Cake (-1.1%). Would you like me to suggest sourcing opportunities for these products?",
        supplier:
          "For celebration cakes, you currently have 4 approved suppliers: Finsbury Food Group (primary), Baker & Baker, BBF Ltd, and Lightbody Celebration Cakes. Finsbury handles 60% of volume. Would you like to see their performance comparison?",
        tender:
          "You have 2 tenders closing this week: The 'Everyday Sponge Cakes' tender closes on Friday with 3 responses received, and the 'Premium Celebration Cakes' tender closes Thursday with 5 responses. Shall I prepare a summary of the offers?",
        offer:
          "For Victoria Sponge, you have 3 active offers: Finsbury at £1.42/unit (current supplier), Baker & Baker at £1.38/unit (-2.8%), and BBF at £1.45/unit. Baker & Baker offers the best price but requires a 12-week lead time vs Finsbury's 6 weeks.",
      }

      let response =
        "I'd be happy to help with that. Could you provide more details about what specific information you're looking for regarding the bakery category?"

      const lowerInput = input.toLowerCase()
      if (lowerInput.includes("margin") || lowerInput.includes("declining")) {
        response = responses.margin
      } else if (lowerInput.includes("supplier") || lowerInput.includes("cake")) {
        response = responses.supplier
      } else if (lowerInput.includes("tender") || lowerInput.includes("closing")) {
        response = responses.tender
      } else if (lowerInput.includes("offer") || lowerInput.includes("compare") || lowerInput.includes("victoria")) {
        response = responses.offer
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open AI Assistant</span>
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 shadow-2xl border-border bg-card transition-all duration-200 ${isMinimized ? "w-80 h-14" : "w-96 h-[32rem]"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-secondary/50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm text-card-foreground">Sourcing Assistant</p>
            {!isMinimized && <p className="text-xs text-muted-foreground">AI-powered insights</p>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-card-foreground"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-card-foreground"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="h-80 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground rounded-xl px-4 py-2.5 text-sm">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs px-2.5 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about sourcing, suppliers, tenders..."
                className="flex-1 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  )
}

export { AIChatBot as AiChatBot }
