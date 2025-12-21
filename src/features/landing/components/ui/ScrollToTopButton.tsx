import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopButtonProps {
    visible: boolean;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ visible }) => {
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div
            className={`fixed right-6 bottom-6 z-40 transition-all duration-500 ${visible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
        >
            <Button
                onClick={handleScrollToTop}
                size="icon"
                className="rounded-full shadow-lg bg-secondary hover:bg-yellow-500 text-secondary-foreground h-12 w-12"
            >
                <ChevronUp className="h-6 w-6" />
            </Button>
        </div>
    );
};
