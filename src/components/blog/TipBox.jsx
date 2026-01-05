import { Lightbulb } from 'lucide-react';

const TipBox = ({ title, children }) => {
    return (
        <div className="my-10 bg-[#FFFBEB] border border-[#FCD34D] rounded-2xl p-6 md:p-8 flex items-start gap-4">
            <div className="bg-[#FCD34D] p-2 rounded-full flex-shrink-0 text-black">
                <Lightbulb className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
                <h4 className="font-serif font-bold text-lg text-black mb-2">{title || "Pro Tip"}</h4>
                <p className="text-black/80 text-base leading-relaxed font-sans">{children}</p>
            </div>
        </div>
    );
};

export default TipBox;
