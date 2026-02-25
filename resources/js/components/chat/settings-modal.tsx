import { Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppearance } from '@/hooks/use-appearance';

export interface SettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClearChat: () => void;
}

export function SettingsModal({
    open,
    onOpenChange,
    onClearChat,
}: SettingsModalProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const handleThemeChange = (checked: boolean) => {
        updateAppearance(checked ? 'dark' : 'light');
    };

    const handleClearChat = () => {
        onClearChat();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Customize your chat experience.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <Label htmlFor="theme-mode" className="flex-1">
                            Theme mode
                        </Label>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">
                                Light
                            </span>
                            <Switch
                                id="theme-mode"
                                checked={isDark}
                                onCheckedChange={handleThemeChange}
                            />
                            <span className="text-muted-foreground text-sm">
                                Dark
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <Label htmlFor="notification-sounds" className="flex-1">
                            Notification sounds
                        </Label>
                        <Switch id="notification-sounds" defaultChecked />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="destructive"
                        onClick={handleClearChat}
                        className="gap-2"
                    >
                        <Trash2 className="size-4" />
                        Clear chat
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
