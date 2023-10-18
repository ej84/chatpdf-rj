'use client'
import React from 'react';
import { Input } from './ui/input';
import { useChat } from 'ai/react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import MessageList from './MessageList';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Message } from 'ai';

type Props = {chatId: number};

const ChatComponent = ({chatId}: Props) => {
    const {data, isLoading} = useQuery({
        queryKey: ["chat", chatId],
        queryFn: async () => {
            const response = await axios.post<Message[]>('/api/get-messages', {chatId})
            return response.data
        }
    });
    const {input, handleInputChange, handleSubmit, messages} = useChat({
        api: '/api/chat',
        body: {
            chatId,
        },
        initialMessages: data || [],
    });
    React.useEffect(()=>{
        const messageContainer = document.getElementById('messageContainer');
        if (messageContainer) {
            messageContainer.scrollTo({
                top: messageContainer.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);
    return (
    <div className='relative max-h-screen overflow-scroll' id="messageContainer">
        {/* Header */}
        <div className='sticky top-0 inset-x-0 p-2 bg-white h-fit'>
            <h3 className='text-xl font-bold'>Chat</h3>
        </div>

        {/* Message List */}
        <MessageList messages={messages} isLoading={isLoading} />

        <form onSubmit={handleSubmit} className='sticky bottom-0 inset-x-0 px-2 py-4 bg-white'>
            <div className='flex'>
                <Input value={input} onChange={handleInputChange} placeholder='Ask Any Question..' className='w-full' />
                <Button className='bg-blue-600 ml-1.5'>
                    <Send className='h-4 w-4' />
                </Button>
            </div>
        </form>
    </div>
    )
};

export default ChatComponent;