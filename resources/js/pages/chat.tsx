import { Head, Link } from '@inertiajs/react';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { history } from '@/routes/chat';
import { Button } from '@/components/ui/button';
import { MessageBubble } from '@/components/chat/message-bubble';
import type { MessageRole } from '@/components/chat/message-bubble';
import { ChatInput } from '@/components/chat/chat-input';
import type { AttachmentPreview } from '@/components/chat/chat-input';
import { SettingsModal } from '@/components/chat/settings-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const BOT_RESPONSES = [
    'Hi there! How can I assist you?',
    "That's an interesting point!",
    'Sure, I can help with that.',
    "Let's think this through together.",
    'Sounds good to me!',
    'Alright 👍',
];

export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
}

function randomBotResponse(): string {
    return BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
}

export default function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const botReplyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isBotTyping, scrollToBottom]);

    useEffect(() => {
        return () => {
            if (botReplyTimeoutRef.current) {
                clearTimeout(botReplyTimeoutRef.current);
            }
        };
    }, []);

    const handleSend = useCallback(
        (text: string, _attachments?: AttachmentPreview[] | null) => {
            const trimmed = text.trim();
            const hasAttachments =
                _attachments != null && _attachments.length > 0;
            if (!trimmed && !hasAttachments) return;

            const userMessage: ChatMessage = {
                id: `user-${Date.now()}`,
                role: 'user',
                content: trimmed,
            };
            setMessages((prev) => [...prev, userMessage]);
            setIsBotTyping(true);

            if (botReplyTimeoutRef.current) {
                clearTimeout(botReplyTimeoutRef.current);
            }
            botReplyTimeoutRef.current = setTimeout(() => {
                const botMessage: ChatMessage = {
                    id: `bot-${Date.now()}`,
                    role: 'bot',
                    content: randomBotResponse(),
                };
                setMessages((prev) => [...prev, botMessage]);
                setIsBotTyping(false);
                botReplyTimeoutRef.current = null;
            }, 1000);
        },
        []
    );

    const handleClearChat = useCallback(() => {
        setMessages([]);
        if (botReplyTimeoutRef.current) {
            clearTimeout(botReplyTimeoutRef.current);
            botReplyTimeoutRef.current = null;
        }
        setIsBotTyping(false);
    }, []);

    return (
        <>
            <Head title="Chat" />
            <div className="flex h-screen flex-col bg-background">
                <header className="flex shrink-0 items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Link
                            href={history().url}
                            className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        >
                            Chat History
                        </Link>
                        <span className="text-muted-foreground/60">|</span>
                        <h1 className="font-semibold">Chatbot</h1>
                        <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <span
                                className={cn(
                                    'size-2 rounded-full bg-green-500',
                                    'ring-2 ring-green-500/30'
                                )}
                                aria-hidden
                            />
                            Online
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSettingsOpen(true)}
                        aria-label="Open settings"
                    >
                        <Settings className="size-5" />
                    </Button>
                </header>

                <main className="flex-1 overflow-y-auto p-4">
                    <div className="mx-auto flex max-w-2xl flex-col gap-3">
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                role={msg.role}
                                content={msg.content}
                            />
                        ))}
                        {isBotTyping && (
                            <div className="flex justify-start">
                                <div className="flex max-w-[85%] items-center gap-2 rounded-2xl bg-muted px-4 py-2.5">
                                    <Skeleton className="size-2 rounded-full" />
                                    <Skeleton className="size-2 rounded-full" />
                                    <Skeleton className="size-2 rounded-full" />
                                    <span className="text-muted-foreground text-sm">
                                        Bot is typing…
                                    </span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </main>

                <div className="shrink-0">
                    <ChatInput onSend={handleSend} />
                </div>
            </div>

            <SettingsModal
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                onClearChat={handleClearChat}
            />
        </>
    );
}
