import ChatComponent from '@/components/ChatComponent';
import ChatSideBar from '@/components/ChatSideBar';
import PDFViewer from '@/components/PDFViewer';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
    params: {
        chatId: string
    }
};

const ChatPage = async ({params:{chatId}}: Props) => {
    // check if the user id is valid and redirect to sign in page if not.
    const {userId} = await auth()
    if (!userId) {
        return redirect('/sign-in');
    }

    // get the whole list of chats from database that matches the userId.
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId))

    // redirect to main if chat for the userId is not found at all.
    if (!_chats.find((chat)=> chat.id === parseInt(chatId))) {
        return redirect('/');
    }

    const currentChat = _chats.find(chat => chat.id === parseInt(chatId))

    return <div className='flex max-h-screen overflow-scroll'>
        <div className='flex w-full max-h-screen overflow-scroll'>
            {/* chats sidebar */}
            <div className='flex-[1] max-w-xs'>
               <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
            </div>

            {/* pdf viewer */}
            <div className='max-h-screen p-4 overflow-scroll flex-[5]'>
                <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
            </div>

            {/* chat component */}
            <div className='flex-[3] border-l-4 border-l-slate-200'>
                <ChatComponent chatId={parseInt(chatId)} />
            </div>
        </div>
    </div>;
};

export default ChatPage;