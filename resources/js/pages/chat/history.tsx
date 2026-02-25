import { Head, Link } from '@inertiajs/react';
import { MessageSquarePlus } from 'lucide-react';
import { chat } from '@/routes';
import { ChatHistoryCard } from '@/components/chat/chat-history-card';
import type { ChatHistoryItem } from '@/components/chat/chat-history-card';
import { Button } from '@/components/ui/button';

const CHAT_HISTORY: ChatHistoryItem[] = [
    {
        id: 1,
        title: 'Chat with AI – Feb 24, 2026',
        lastMessage: 'Sure, I can help!',
        time: '10:32 AM',
    },
    {
        id: 2,
        title: 'Chat with Support – Feb 22, 2026',
        lastMessage: 'Thank you for confirming!',
        time: '08:10 PM',
    },
    {
        id: 3,
        title: 'Chat with Bot – Feb 20, 2026',
        lastMessage: "Let's explore that.",
        time: '02:41 PM',
    },
];

export default function ChatHistoryPage() {
    return (
        <>
            <Head title="Chat History" />
            <div className="min-h-screen bg-background">
                <header className="border-b px-4 py-4">
                    <h1 className="text-xl font-semibold">Chat History</h1>
                </header>

                <main className="mx-auto max-w-5xl p-4">
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {CHAT_HISTORY.map((item) => (
                            <ChatHistoryCard
                                key={item.id}
                                item={item}
                                href={chat().url}
                            />
                        ))}
                    </div>
                </main>

                <div className="fixed bottom-6 right-6">
                    <Button size="lg" className="gap-2 rounded-full shadow-lg" asChild>
                        <Link href={chat().url}>
                            <MessageSquarePlus className="size-5" />
                            New Chat
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
