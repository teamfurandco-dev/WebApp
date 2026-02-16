import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Newsletter = () => {
    return (
        <div className="w-full py-12 md:py-20 bg-[#FAF8F5] border-t border-black/5">
            <div className="container mx-auto px-3 md:px-4 text-center max-w-2xl">
                <h3 className="text-xl md:text-3xl font-medium text-black mb-3 md:mb-4">
                    Join the Journal
                </h3>
                <p className="text-black/60 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                    Wellness tips, science-backed insights, and early access to curated essentials.
                </p>

                <form className="flex flex-col sm:flex-row gap-2 md:gap-3 px-2 sm:px-0">
                    <Input
                        type="email"
                        placeholder="Your email"
                        className="bg-black text-white placeholder:text-white/50 border-white/10 h-11 md:h-12 rounded-full px-4 md:px-6 focus:border-white transition-colors text-sm"
                    />
                    <Button type="submit" className="bg-[#ffcc00] text-black hover:bg-black hover:text-[#ffcc00] rounded-full px-5 md:px-8 h-11 md:h-12 transition-colors font-medium text-sm">
                        Subscribe
                    </Button>
                </form>
                <p className="text-[10px] md:text-xs text-black/30 mt-3 md:mt-4">
                    By subscribing, you agree to our Terms & Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default Newsletter;
