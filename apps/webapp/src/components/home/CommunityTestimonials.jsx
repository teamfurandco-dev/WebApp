import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import silentPromiseImage from '@/assets/silent_promise.png';

const CommunityTestimonials = () => {
    return (
        <section className="py-6 md:py-0 min-h-[50vh] md:min-h-[calc(100vh-80px-13vh)] flex flex-col justify-center bg-white">
            <div className="container mx-auto px-3 md:px-8 h-full flex flex-col justify-center">
                {/* Section Header */}
                <div className="mb-6 md:mb-10 py-[5px]">
                    <h2 className="text-2xl md:text-4xl font-peace-sans font-medium text-black mb-1 md:mb-2">
                        A Silent Promise
                    </h2>
                    <p className="text-black/60 text-sm md:text-lg font-light">
                        Every choice you make matters.
                    </p>
                </div>

                {/* Visual Anchor Layout - 60/40 Split */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-12 items-center rounded-2xl md:rounded-[3rem] overflow-hidden bg-[#F9F8F6] shadow-lg">
                    {/* Left Side - Image (60%) */}
                    <div className="lg:col-span-3 h-[250px] md:h-[450px] lg:h-[500px] relative overflow-hidden rounded-2xl md:rounded-[3rem]">
                        <img
                            src={silentPromiseImage}
                            alt="Pet Trust"
                            className="w-full h-full object-cover grayscale-[20%] opacity-90"
                        />
                    </div>

                    {/* Right Side - Text (40%) */}
                    <div className="lg:col-span-2 p-5 md:p-10 lg:py-16 lg:pr-16 space-y-4 md:space-y-6">
                        {/* Headline */}
                        <h3 className="text-lg md:text-3xl lg:text-4xl font-peace-sans font-medium text-black leading-tight">
                            They give you their best every day. They trust you to do the same.
                        </h3>

                        {/* Body */}
                        <p className="text-sm md:text-lg text-black/70 font-light leading-relaxed" style={{ lineHeight: '1.7' }}>
                            Your pet can't read a label or choose their own care. They have no voice to ask for better, they only have you.
                        </p>

                        {/* CTA Button */}
                        <div className="pt-2">
                            <Link to="/products">
                                <Button className="bg-black text-white hover:bg-furco-brown border-none rounded-full px-6 py-3 md:px-10 md:py-6 text-sm transition-all shadow-lg hover:shadow-xl w-full md:w-auto">
                                    Honor Their Trust
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunityTestimonials;
