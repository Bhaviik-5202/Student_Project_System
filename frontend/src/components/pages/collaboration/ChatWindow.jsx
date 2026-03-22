import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import chatService from '../../../services/chatService';
import { useAuth } from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';

const ChatWindow = memo(() => {
  const navigate = useNavigate();
  const { id: chatId } = useParams();
  const { user: currentUser } = useAuth();
  const { showError } = useNotification();

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchChatData = useCallback(async () => {
    if (!chatId) return;
    try {
      setLoading(true);
      const [chatResp, messagesResp] = await Promise.all([
        chatService.getChatById(chatId),
        chatService.getMessages(chatId),
      ]);

      if (chatResp.success) {
        setChat(chatResp.data);
      }
      if (messagesResp.success) {
        setMessages(messagesResp.data);
      }
    } catch (error) {
      showError('Failed to load chat data');
    } finally {
      setLoading(false);
    }
  }, [chatId, showError]);

  useEffect(() => {
    fetchChatData();
  }, [fetchChatData]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    try {
      const response = await chatService.sendMessage(chatId, newMessage);
      if (response.success) {
        setMessages((prev) => [...prev, response.data]);
        setNewMessage('');
      }
    } catch (error) {
      showError('Failed to send message');
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <button
            onClick={() => navigate('/chat')}
            className='mb-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
          >
            ← Back to Chats
          </button>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
                {chat?.name || (loading ? 'Loading...' : 'Team Chat')}
              </h1>
              <p className='text-slate-600 dark:text-slate-400'>
                {chat?.isGroup ? 'Group Chat' : 'Direct Message'}
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
          {/* Members List */}
          <div className='lg:col-span-1'>
            <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
              <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
                Team Members
              </h3>
              <div className='space-y-3'>
                {loading ? (
                  <div className='py-4 text-center text-slate-500'>
                    Loading...
                  </div>
                ) : (
                  chat?.members?.map((member, index) => (
                    <div
                      key={member._id || index}
                      className='flex items-center rounded-lg border border-slate-200 p-3 dark:border-slate-700'
                    >
                      <div className='relative'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
                          {(member.name || 'U').charAt(0)}
                        </div>
                        <div
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-800 ${
                            member.online ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        ></div>
                      </div>
                      <div className='ml-3'>
                        <div className='font-medium text-slate-900 dark:text-white'>
                          {member.name}
                        </div>
                        <div className='text-sm text-slate-600 dark:text-slate-400'>
                          {member.user?.role || 'Member'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className='lg:col-span-3'>
            <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
              <div className='mb-4 h-[450px] space-y-4 overflow-y-auto pr-2'>
                {messages.length === 0 && !loading ? (
                  <div className='flex h-full items-center justify-center text-slate-500'>
                    No messages yet.
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMe =
                      (message.sender?._id || message.sender) ===
                      (currentUser?._id || currentUser?.id);
                    return (
                      <div
                        key={message._id || message.id}
                        className={`flex ${isMe ? 'justify-end' : ''}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md ${
                            isMe
                              ? 'bg-blue-100 dark:bg-blue-900/30'
                              : 'bg-slate-100 dark:bg-slate-700'
                          } rounded-lg p-4`}
                        >
                          {!isMe && (
                            <div className='mb-1 font-medium text-slate-900 dark:text-white'>
                              {message.sender?.name || 'Unknown'}
                            </div>
                          )}
                          <div className='whitespace-pre-wrap break-words text-slate-700 dark:text-slate-200'>
                            {message.content}
                          </div>
                          <div className='mt-2 text-right text-xs text-slate-500 dark:text-slate-400'>
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <div className='border-t border-slate-200 pt-4 dark:border-slate-700'>
                <form onSubmit={handleSendMessage} className='flex gap-3'>
                  <input
                    type='text'
                    className='flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-600'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                      loading ? 'Loading...' : 'Type your message here...'
                    }
                    disabled={loading}
                  />
                  <button
                    type='submit'
                    disabled={!newMessage.trim() || loading}
                    className='rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800'
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;
