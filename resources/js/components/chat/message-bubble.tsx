import { cn } from '@/lib/utils';

export type MessageRole = 'user' | 'bot';

export interface MessageBubbleProps {
    role: MessageRole;
    content: string;
    className?: string;
}

export function MessageBubble({ role, content, className }: MessageBubbleProps) {
    const isUser = role === 'user';

    return (
        <div
            className={cn(
                'flex w-full transition-opacity',
                isUser ? 'justify-end' : 'justify-start',
                className
            )}
        >
            <div
                className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                    isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                )}
            >
                <p className="whitespace-pre-wrap wrap-break-word">{content}</p>
            </div>
        </div>
    );
}
