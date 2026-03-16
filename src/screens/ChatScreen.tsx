import { useState, useRef, useEffect } from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

export function ChatScreen() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { chatMessages, addChatMessage } = useAppStore();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    addChatMessage({ role: 'user', content: userMessage });
    
    // Simulate AI response (placeholder - would connect to Lovable AI in production)
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "That's a great question about bladder health. The bladder is a muscular organ that stores urine produced by the kidneys. It can typically hold 400-600mL of urine.",
        "Tracking your fluid intake and voiding patterns is essential for understanding your urological health. I recommend logging all beverages and bathroom visits consistently for at least 3 days.",
        "The IPSS questionnaire helps assess the severity of lower urinary tract symptoms. A score of 0-7 indicates mild symptoms, 8-19 moderate, and 20-35 severe.",
        "It's important to stay well-hydrated, but timing matters. Try to limit fluids 2-3 hours before bedtime to reduce nighttime urination.",
        "Caffeine and alcohol are known bladder irritants. Reducing intake of these beverages may help improve your symptoms.",
      ];
      
      addChatMessage({
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
      });
      setIsTyping(false);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Disclaimer */}
      <div className="bg-warning/10 border-b border-warning/20 px-3 py-1.5 flex items-center gap-2 flex-shrink-0">
        <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0" />
        <p className="text-[10px] text-warning">
          Dia is an educational assistant and cannot provide medical advice.
        </p>
      </div>
      
      {/* Messages - scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble ${message.role}`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-bubble assistant">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="border-t border-border p-3 bg-card flex-shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Dia about bladder health..."
            className="flex-1 p-2.5 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
