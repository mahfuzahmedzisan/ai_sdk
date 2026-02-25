import { Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ChatHistoryItem {
    id: number;
    title: string;
    lastMessage: string;
    time: string;
}

export interface ChatHistoryCardProps {
    item: ChatHistoryItem;
    href: string;
    className?: string;
}

export function ChatHistoryCard({ item, href, className }: ChatHistoryCardProps) {
    return (
        <Card
            className={cn(
                'transition-shadow hover:shadow-md dark:hover:shadow-md',
                className
            )}
        >
            <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1 text-base">
                    {item.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
                <p className="line-clamp-2 text-muted-foreground text-sm">
                    {item.lastMessage}
                </p>
                <p className="mt-1 text-muted-foreground/80 text-xs">
                    {item.time}
                </p>
            </CardContent>
            <CardFooter>
                <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={href}>View Chat</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
