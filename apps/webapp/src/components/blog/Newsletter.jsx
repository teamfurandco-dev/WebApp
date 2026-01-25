import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Newsletter = () => {
    return (
        <div className="w-full py-20 bg-[#FAF8F5] border-t border-black/5">
            <div className="container mx-auto px-4 text-center max-w-2xl">
                <h3 className="text-3xl font-serif font-medium text-black mb-4">
                    Join the Fur & Co Journal
                </h3>
                <p className="text-black/60 mb-8 leading-relaxed">
                    Wellness tips, science-backed insights, and early access to curated essentials. No spam, just love.
                </p>

                <form className="flex flex-col sm:flex-row gap-3">
                    <Input
                        type="email"
                        placeholder="Your email address"
                        className="bg-white border-black/10 h-12 rounded-full px-6 focus:border-black transition-colors"
                    />
                    <Button type="submit" className="bg-black text-white hover:bg-furco-gold hover:text-black rounded-full px-8 h-12 transition-colors font-medium">
                        Subscribe
                    </Button>
                </form>
                <p className="text-xs text-black/30 mt-4">
                    By subscribing, you agree to our Terms & Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default Newsletter;
