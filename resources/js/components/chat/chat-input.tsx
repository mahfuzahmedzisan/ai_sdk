import { useState, useCallback, useRef, useEffect } from 'react';
import { Paperclip, Send, FileIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export interface AttachmentPreview {
    name: string;
    type?: string;
}

export interface AttachmentWithFile extends AttachmentPreview {
    file: File;
    objectUrl?: string;
}

const isImageType = (type: string) => type.startsWith('image/');

export interface ChatInputProps {
    onSend: (text: string, attachments?: AttachmentPreview[] | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function ChatInput({
    onSend,
    placeholder = 'Type your message…',
    disabled = false,
    className,
}: ChatInputProps) {
    const [text, setText] = useState('');
    const [attachments, setAttachments] = useState<AttachmentWithFile[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const revokeOne = useCallback((a: AttachmentWithFile) => {
        if (a.objectUrl) URL.revokeObjectURL(a.objectUrl);
    }, []);

    const removeAttachmentAt = useCallback(
        (index: number) => {
            setAttachments((prev) => {
                const next = prev.slice();
                revokeOne(next[index]);
                next.splice(index, 1);
                return next;
            });
            if (lightboxIndex !== null) {
                if (lightboxIndex === index) setLightboxIndex(null);
                else if (lightboxIndex > index)
                    setLightboxIndex(lightboxIndex - 1);
            }
        },
        [lightboxIndex, revokeOne]
    );

    useEffect(() => {
        return () => {
            attachments.forEach(revokeOne);
        };
    }, [attachments, revokeOne]);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            const trimmed = text.trim();
            if (!trimmed && attachments.length === 0) return;
            const previews: AttachmentPreview[] = attachments.map((a) => ({
                name: a.name,
                type: a.type,
            }));
            onSend(trimmed || ' ', previews.length ? previews : null);
            setText('');
            attachments.forEach(revokeOne);
            setAttachments([]);
            setLightboxIndex(null);
        },
        [text, attachments, onSend, revokeOne]
    );

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const fileList = e.target.files;
            if (!fileList?.length) return;
            const newAttachments: AttachmentWithFile[] = [];
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                if (!(file instanceof File)) continue;
                const objectUrl = isImageType(file.type)
                    ? URL.createObjectURL(file)
                    : undefined;
                newAttachments.push({
                    name: file.name,
                    type: file.type,
                    file,
                    objectUrl,
                });
            }
            if (newAttachments.length > 0) {
                setAttachments((prev) => [...prev, ...newAttachments]);
            }
            e.target.value = '';
        },
        []
    );

    const handleAttachClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const openLightbox = useCallback((index: number) => {
        setLightboxIndex(index);
    }, []);

    const lightboxAttachment =
        lightboxIndex !== null ? attachments[lightboxIndex] ?? null : null;
    const lightboxIsImage = lightboxAttachment?.objectUrl != null;

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className={cn(
                    'flex flex-col gap-3 border-t bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60',
                    className
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="*/*"
                    className="sr-only"
                    aria-hidden
                    onChange={handleFileChange}
                />

                {attachments.length > 0 && (
                    <div className="flex flex-wrap items-start gap-2">
                        {attachments.map((attachment, index) => {
                            const isImage = attachment.objectUrl != null;
                            return (
                                <button
                                    key={`${attachment.name}-${index}`}
                                    type="button"
                                    onClick={() => openLightbox(index)}
                                    className={cn(
                                        'relative flex size-20 shrink-0 overflow-hidden rounded-lg border-2 border-border bg-muted transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                    )}
                                    aria-label={`Preview ${attachment.name}`}
                                >
                                    {isImage ? (
                                        <img
                                            src={attachment.objectUrl}
                                            alt=""
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex size-full flex-col items-center justify-center gap-0.5 p-1 text-center">
                                            <FileIcon className="size-8 text-muted-foreground" />
                                            <span className="line-clamp-2 text-[10px] text-muted-foreground">
                                                {attachment.name}
                                            </span>
                                        </div>
                                    )}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-1 right-1 size-6 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeAttachmentAt(index);
                                        }}
                                        aria-label={`Remove ${attachment.name}`}
                                    >
                                        <X className="size-3" />
                                    </Button>
                                </button>
                            );
                        })}
                    </div>
                )}

                <div className="flex items-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleAttachClick}
                        disabled={disabled}
                        aria-label="Attach file"
                    >
                        <Paperclip className="size-4" />
                    </Button>
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="min-h-9 flex-1"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={
                            disabled &&
                            !text.trim() &&
                            attachments.length === 0
                        }
                        aria-label="Send message"
                    >
                        <Send className="size-4" />
                    </Button>
                </div>
            </form>

            <Dialog
                open={lightboxIndex !== null}
                onOpenChange={(open) => !open && setLightboxIndex(null)}
            >
                <DialogContent
                    className="max-h-[90vh] max-w-[90vw] border-0 bg-black/95 p-0 text-white focus:outline-none [&_button]:text-white [&_button]:hover:bg-white/20 [&_button]:hover:text-white sm:max-w-[90vw]"
                    onPointerDownOutside={(e) => e.stopPropagation()}
                >
                    <DialogTitle className="sr-only">
                        {lightboxAttachment?.name ?? 'Attachment preview'}
                    </DialogTitle>
                    {lightboxAttachment && (
                        <div className="flex min-h-[200px] items-center justify-center p-4">
                            {lightboxIsImage ? (
                                <img
                                    src={lightboxAttachment.objectUrl}
                                    alt={lightboxAttachment.name}
                                    className="max-h-[85vh] max-w-full object-contain"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-3 text-white">
                                    <FileIcon className="size-16 text-white/70" />
                                    <p className="text-center font-medium">
                                        {lightboxAttachment.name}
                                    </p>
                                    <p className="text-white/70 text-sm">
                                        {lightboxAttachment.type || 'File'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
