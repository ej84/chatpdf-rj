'use client'
import React from 'react';
import { Input } from './ui/input';
import { useChat } from 'ai/react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';

type Props = {};

const ChatComponent = (props: Props) => {
    const {input, handleInputChange, handleSubmit, messages} = useChat();
    return (
    <div className='relative max-h-screen overflow-scroll'>
        {/* Header */}
        <div className='sticky top-0 inset-x-0 p-2 bg-white h-fit'>
            <h3 className='text-xl font-bold'>Chat</h3>
        </div>

        {/* Message List */}
        <form onSubmit={handleSubmit} className='sticky bottom-0 inset-x-0 px-2 py-4 bg-white'>
            <Input value={input} onChange={handleInputChange} placeholder='Ask Any Question..' className='w-full' />
            <Button className='bg-blue-600 ml-1'>
                <Send className='h-4 w-4' />
            </Button>
        </form>
    </div>
    )
};

export default ChatComponent;