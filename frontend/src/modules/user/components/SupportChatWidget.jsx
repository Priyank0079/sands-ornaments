import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ChevronLeft, Plus, Headphones, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupport } from '../../../context/SupportContext';
import { useAuth } from '../../../context/AuthContext';
import StillNeedHelpCard from './StillNeedHelpCard';
import toast from 'react-hot-toast';

const SupportChatWidget = ({ inline = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isCustomer = user?.role === 'user';
  const {
    tickets,
    activeTicket,
    activeTicketId,
    setActiveTicketId,
    isOpen,
    setIsOpen,
    createNewTicket,
    sendReply,
    isLoading
  } = useSupport();

  const [view, setView] = useState('hub'); // 'hub' | 'list' | 'chat' | 'create'
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTicket?.replies]);

  // Open ticket chat when a notification targets a specific ticket
  useEffect(() => {
    if (activeTicketId && isOpen) {
      setView('chat');
    }
  }, [activeTicketId, isOpen]);

  const handleToggleOpen = () => {
    if (!isOpen) {
      setView('hub');
      setActiveTicketId(null);
    }
    setIsOpen(!isOpen);
  };

  const handleContactSupport = () => {
    if (isCustomer) {
      setView('list');
      return;
    }
    toast('Please log in to open a support ticket.', { icon: '🔐' });
    setIsOpen(false);
    navigate('/login', { state: { from: '/help-center' } });
  };

  const handleCreateTicketSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    const ticket = await createNewTicket(subject, category, message);
    if (ticket) {
      setSubject('');
      setMessage('');
      setView('chat');
    }
  };

  const handleSendReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicketId) return;
    const success = await sendReply(activeTicketId, replyText);
    if (success) {
      setReplyText('');
    }
  };

  const categories = [
    "General Inquiry",
    "Order Tracking",
    "Payment Issue",
    "Return/Refund",
    "Product Feedback",
    "Other"
  ];

  // Helper for status colors
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'In Progress': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Resolved': return 'bg-green-50 text-green-700 border-green-100';
      case 'Closed': return 'bg-gray-50 text-gray-700 border-gray-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const buttonPositionClass = inline
    ? 'support-floating relative'
    : 'support-floating fixed bottom-[calc(5rem+3.5rem+0.75rem)] md:bottom-[calc(2rem+4rem+0.75rem)] right-6 z-[10000]';

  return (
    <div className="support-chat-widget-container">
      {/* Floating Button — visible for all visitors */}
      <motion.button
        onClick={handleToggleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Contact support"
        className={`${buttonPositionClass} flex items-center justify-center w-14 h-14 bg-[#9C5B61] text-white rounded-full shadow-[0_10px_25px_rgba(156,91,97,0.4)] hover:bg-[#7A2E3A] transition-colors cursor-pointer group shrink-0`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative"
            >
              <Headphones className="w-6 h-6" />
              {/* Unread dot indicator */}
              {isCustomer && tickets.some(t => t.status === 'In Progress') && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Expandable Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 md:right-6 z-[10000] w-full shadow-2xl overflow-hidden ${
              view === 'hub'
                ? 'bottom-0 md:bottom-[11.5rem] md:w-[340px] md:rounded-3xl p-4 md:p-0 bg-transparent'
                : 'bottom-0 md:bottom-[11.5rem] md:w-[380px] h-full md:h-[550px] bg-white md:rounded-3xl border border-gray-100 flex flex-col'
            }`}
          >
            {view === 'hub' ? (
              <div className="relative h-full md:h-auto flex flex-col justify-end md:justify-start min-h-0">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 md:top-4 md:right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Close support panel"
                >
                  <X className="w-4 h-4" />
                </button>
                <StillNeedHelpCard
                  compact
                  onContactSupport={handleContactSupport}
                  className="rounded-t-3xl md:rounded-3xl min-h-[min(100dvh,520px)] md:min-h-0"
                />
              </div>
            ) : (
              <>
            {/* Header */}
            <div className="bg-[#9C5B61] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setView('hub');
                    setActiveTicketId(null);
                  }}
                  className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
                  aria-label="Back to contact options"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm tracking-wide">Sands Support</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-[10px] text-white/80 font-medium">Support Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-hidden flex flex-col bg-gray-50/50">
              <AnimatePresence mode="wait">
                {/* 1. TICKET CHAT VIEW */}
                {view === 'chat' && activeTicket && (
                  <motion.div
                    key="chat-view"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-grow flex flex-col overflow-hidden h-full"
                  >
                    {/* Active Ticket Details TopBar */}
                    <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setActiveTicketId(null);
                          setView('list');
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-black transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{activeTicket.subject}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">#{activeTicket.ticketId}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeClass(activeTicket.status)}`}>
                        {activeTicket.status}
                      </span>
                    </div>

                    {/* Messages Scroll Thread */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                      {/* Original Initial message */}
                      <div className="flex flex-col items-start max-w-[85%]">
                        <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs font-medium shadow-sm border border-gray-200/50">
                          {activeTicket.message}
                        </div>
                        <span className="text-[9px] text-gray-400 mt-1 pl-1">
                          {new Date(activeTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Replies */}
                      {activeTicket.replies?.map((reply, i) => {
                        const isAdmin = reply.from === 'admin';
                        return (
                          <div
                            key={i}
                            className={`flex flex-col max-w-[85%] ${isAdmin ? 'items-start' : 'items-end ml-auto'}`}
                          >
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-xs font-medium shadow-sm border ${
                                isAdmin
                                  ? 'bg-white text-gray-800 rounded-tl-none border-gray-200/50'
                                  : 'bg-[#9C5B61] text-white rounded-tr-none border-[#9C5B61]/10'
                              }`}
                            >
                              {reply.text}
                            </div>
                            <span className="text-[9px] text-gray-400 mt-1 px-1">
                              {new Date(reply.date || reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input form */}
                    {activeTicket.status !== 'Closed' && activeTicket.status !== 'Resolved' ? (
                      <form onSubmit={handleSendReplySubmit} className="bg-white border-t border-gray-100 p-3 flex gap-2 items-center shrink-0">
                        <input
                          type="text"
                          placeholder="Type message..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-grow bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#9C5B61] transition-all"
                        />
                        <button
                          type="submit"
                          disabled={!replyText.trim()}
                          className="w-8 h-8 rounded-full bg-[#9C5B61] text-white flex items-center justify-center hover:bg-[#7A2E3A] disabled:opacity-40 disabled:hover:bg-[#9C5B61] transition-all shrink-0 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <div className="bg-white border-t border-gray-100 p-4 text-center text-xs text-gray-400 font-bold shrink-0">
                        This support ticket is resolved/closed.
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 2. TICKET LIST VIEW */}
                {view === 'list' && (
                  <motion.div
                    key="list-view"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex-grow flex flex-col overflow-hidden h-full"
                  >
                    {/* Main CTA */}
                    <div className="p-4 shrink-0">
                      <button
                        onClick={() => setView('create')}
                        className="w-full bg-[#EBCDD0] text-black py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#D39A9F] hover:text-white transition-all shadow-sm text-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Create Support Request
                      </button>
                    </div>

                    <div className="flex-grow overflow-y-auto px-4 pb-4 space-y-3">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">
                        Your Support History
                      </div>

                      {isLoading ? (
                        <div className="flex justify-center items-center py-10">
                          <span className="w-6 h-6 border-2 border-gray-200 border-t-[#9C5B61] rounded-full animate-spin"></span>
                        </div>
                      ) : tickets.length > 0 ? (
                        tickets.map((t) => (
                          <div
                            key={t._id}
                            onClick={() => {
                              setActiveTicketId(t._id);
                              setView('chat');
                            }}
                            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#9C5B61] transition-all cursor-pointer group flex flex-col gap-2"
                          >
                            <div className="flex justify-between items-start">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getStatusBadgeClass(t.status)}`}>
                                {t.status}
                              </span>
                              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                                #{t.ticketId}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#9C5B61] transition-colors line-clamp-1">
                              {t.subject}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-medium line-clamp-1">
                              {t.replies && t.replies.length > 0
                                ? t.replies[t.replies.length - 1].text
                                : t.message}
                            </p>
                            <div className="text-[9px] text-gray-400/80 font-bold uppercase tracking-widest text-right mt-1">
                              {new Date(t.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200/80 p-6">
                          <Inbox className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                          <p className="text-xs text-gray-500 font-semibold mb-1">No support tickets found</p>
                          <p className="text-[10px] text-gray-400">Need help with an order or product? Create a support request.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 3. TICKET CREATION VIEW */}
                {view === 'create' && (
                  <motion.div
                    key="create-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex-grow flex flex-col overflow-hidden h-full"
                  >
                    <div className="bg-white border-b border-gray-100 px-4 py-3.5 flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setView('list')}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-black transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <h4 className="text-xs font-bold text-gray-900">New Support Request</h4>
                    </div>

                    <form onSubmit={handleCreateTicketSubmit} className="flex-grow overflow-y-auto p-4 space-y-4 flex flex-col">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Subject</label>
                        <input
                          required
                          type="text"
                          placeholder="What do you need help with?"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#9C5B61] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#9C5B61] transition-all"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-grow flex flex-col min-h-[150px]">
                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Detailed Message</label>
                        <textarea
                          required
                          placeholder="Please describe your query..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={6}
                          className="w-full flex-grow bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#9C5B61] resize-none transition-all"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#9C5B61] hover:bg-[#7A2E3A] text-white py-3 rounded-xl font-bold transition-all shadow-sm text-xs cursor-pointer mt-auto shrink-0"
                      >
                        Submit Request
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportChatWidget;
