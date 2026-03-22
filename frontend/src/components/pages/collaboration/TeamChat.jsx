// src/components/pages/collaboration/TeamChat.jsx
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import chatService from '../../../services/chatService';
import projectService from '../../../services/projectService';
import { useAuth } from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';

const TeamChat = memo(() => {
  const { user: currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState('');
  const [messages, setMessages] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { showError } = useNotification();

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [projResp, chatResp] = await Promise.all([
        projectService.getAllProjects(),
        chatService.getUserChats(),
      ]);

      if (projResp.data?.success) {
        setProjects(projResp.data.data);
      }

      if (chatResp.success) {
        setChats(chatResp.data);
        if (chatResp.data.length > 0) {
          setSelectedChatId(chatResp.data[0]._id || chatResp.data[0].id);
        }
      }
    } catch (error) {
      showError('Failed to load chat data');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchMessages = useCallback(async (chatId) => {
    try {
      const response = await chatService.getMessages(chatId);
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  }, []);

  const fetchTeamMembers = useCallback(async (projectId) => {
    try {
      const response = await projectService.getProjectMembers(projectId);
      if (response.data?.success) {
        setTeamMembers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch team members', error);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
      const currentChat = chats.find((c) => (c._id || c.id) === selectedChatId);
      if (currentChat?.project) {
        setSelectedProjectId(currentChat.project);
        fetchTeamMembers(currentChat.project);
      }
    }
  }, [selectedChatId, chats, fetchMessages, fetchTeamMembers]);

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newMessage.trim() || !selectedChatId) return;

      try {
        const response = await chatService.sendMessage(
          selectedChatId,
          newMessage
        );
        if (response.success) {
          setMessages((prev) => [...prev, response.data]);
          setNewMessage('');
        }
      } catch (error) {
        showError('Failed to send message');
      }
    },
    [newMessage, selectedChatId, showError]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className='p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
            Team Chat
          </h1>
          <div className='mt-1 flex items-center gap-3'>
            <span className='text-sm text-slate-500 dark:text-slate-400'>
              Select Chat:
            </span>
            <select
              value={selectedChatId}
              onChange={(e) => setSelectedChatId(e.target.value)}
              className='rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
            >
              <option value='' disabled>
                Select a chat
              </option>
              {chats.map((chat) => (
                <option key={chat._id || chat.id} value={chat._id || chat.id}>
                  {chat.name || 'Unnamed Chat'}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm text-emerald-600 dark:text-emerald-400'>
            <i className='fas fa-circle mr-1 text-emerald-500'></i>
            {teamMembers.filter((m) => m.online).length} Online
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
        {/* Team Members Sidebar */}
        <div className='lg:col-span-1'>
          <div className='rounded-xl bg-white p-6 shadow dark:bg-slate-800'>
            <h3 className='mb-4 font-medium text-slate-900 dark:text-white'>
              Team Members
            </h3>
            <div className='space-y-4'>
              {teamMembers.length === 0 ? (
                <p className='text-sm text-slate-500'>No members found.</p>
              ) : (
                teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-700'
                  >
                    <div className='flex items-center'>
                      <div
                        className={`mr-3 h-3 w-3 rounded-full ${
                          member.online ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      ></div>
                      <div>
                        <p className='text-sm font-medium text-slate-900 dark:text-white'>
                          {member.name || member.user?.name || 'Unknown'}
                        </p>
                        <p className='text-xs text-slate-500 dark:text-slate-400'>
                          {member.role || 'Member'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className='lg:col-span-3'>
          <div className='flex h-[600px] flex-col rounded-xl bg-white shadow dark:bg-slate-800'>
            {/* Chat Header */}
            <div className='border-b border-slate-200 p-4 dark:border-slate-700'>
              <div className='flex items-center justify-between'>
                <h3 className='font-medium text-slate-900 dark:text-white'>
                  {chats.find((c) => (c._id || c.id) === selectedChatId)
                    ?.name || 'Group Chat'}
                </h3>
              </div>
            </div>

            {/* Messages Area */}
            <div className='flex-1 space-y-4 overflow-y-auto p-4'>
              {messages.length === 0 ? (
                <div className='flex h-full items-center justify-center text-slate-500'>
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => {
                  const isMe =
                    (message.sender?._id || message.sender) ===
                    (currentUser?._id || currentUser?.id);
                  return (
                    <div
                      key={message._id || message.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg p-3 lg:max-w-md ${
                          isMe
                            ? 'rounded-br-none bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                            : 'rounded-bl-none bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {!isMe && (
                          <div className='mb-1 text-sm font-medium'>
                            {message.sender?.name || 'Unknown'}
                          </div>
                        )}
                        <p className='whitespace-pre-wrap break-words'>
                          {message.content}
                        </p>
                        <div
                          className={`mt-1 text-xs ${
                            isMe
                              ? 'text-blue-600 dark:text-blue-300'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className='border-t border-slate-200 p-4 dark:border-slate-700'>
              <form
                onSubmit={handleSendMessage}
                className='flex items-center space-x-3'
              >
                <input
                  type='text'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={!selectedChatId}
                  placeholder={
                    selectedChatId
                      ? 'Type your message...'
                      : 'Select a chat first'
                  }
                  className='flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-600'
                />
                <button
                  type='submit'
                  disabled={!newMessage.trim() || !selectedChatId}
                  className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800'
                >
                  <i className='fas fa-paper-plane'></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

TeamChat.displayName = 'TeamChat';

export default TeamChat;
