import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Activity, Zap } from 'lucide-react'
import './App.css'

function App() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setIsLoading(true);
    const question = input;
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question }),
      });
      const data = await response.json();
      setMessages([...newMessages, { role: "bot", text: data.response }]);
    } catch (error) {
      setMessages([...newMessages, { role: "bot", text: "⚠️ Erreur : Vérifie que le terminal Python est lancé." }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="main-container">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel"
      >
        
        {/* HEADER ANABOLIC */}
        <div className="header">
          <div className="header-title">
            <div className="logo-box">
              <Activity size={24} color="white" strokeWidth={3} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', fontStyle: 'italic' }}>
                ANABOLIC <span style={{color: '#ff0040'}}>AI</span>
              </h1>
              {/* Ta signature ici */}
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <span className="status-dot"></span>
                IA CONÇUE PAR PABLO HERNANDEZ
              </p>
            </div>
          </div>
          <Zap color="#ff5e00" fill="#ff5e00" style={{ opacity: 0.8 }} />
        </div>

        {/* ZONE DE CHAT */}
        <div className="chat-area">
          <AnimatePresence>
            {messages.length === 0 && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                <Activity size={100} color="#330000" />
                <p style={{ marginTop: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>PRÊT À L'ENTRAÎNEMENT</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                className={`message-row ${msg.role === "user" ? "user" : "bot"}`}
              >
                <div className={`message-content ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  
                  <div className={`avatar ${msg.role === "user" ? "user-avatar" : "bot-avatar"}`}>
                    {msg.role === "user" ? <User size={18} /> : <Bot size={18} color="#ff0040" />}
                  </div>

                  <div className="message-bubble">
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="message-row bot">
                 <div className="message-content">
                    <div className="avatar bot-avatar"><Bot size={18} color="#ff0040" /></div>
                    <div className="message-bubble" style={{ fontStyle: 'italic', opacity: 0.7, color: '#ff0040' }}>
                      Calcul de la charge...
                    </div>
                 </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        {/* INPUT */}
        <div className="input-area">
          <div className="input-wrapper">
            <input 
              type="text" 
              className="chat-input"
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Donne tes instructions..."
            />
            <button 
              className="send-btn"
              onClick={sendMessage}
              disabled={isLoading}
            >
              <Send size={20} color="white" />
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  )
}

export default App