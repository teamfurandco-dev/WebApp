import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Package, RefreshCcw, HelpCircle, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@fur-co/utils';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import womenWithDog from '@/assets/women_with_dog.png';

// Note: You will need to replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

const Contact = () => {
    const { currentMode } = useTheme();
    const navigate = useNavigate();
    const isUnlimitedMode = currentMode === 'CORE';
    const formRef = useRef();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const [formState, setFormState] = useState({
        name: '',
        petName: '',
        user_email: '', // EmailJS typically expects user_email
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formState.name || !formState.user_email || !formState.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Check if credentials are set, otherwise use a fallback for demo
            if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
                console.warn("EmailJS credentials not configured. Simulating success...");
                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                await emailjs.sendForm(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    formRef.current,
                    EMAILJS_PUBLIC_KEY
                );
            }

            setSubmitStatus('success');
            setFormState({ name: '', petName: '', user_email: '', message: '' });
            toast.success('Message sent! Our pack will get back to you soon.');

            // Revert status after 5 seconds
            setTimeout(() => setSubmitStatus(null), 5000);
        } catch (error) {
            console.error('Email failed:', error);
            setSubmitStatus('error');
            toast.error('Failed to send message. Please try again or email us directly.');

            // Revert status after 5 seconds
            setTimeout(() => setSubmitStatus(null), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            label: 'Email Us',
            value: 'hellopaws@furandco.in',
            color: 'bg-[#FFCC00]'
        }
    ];

    const topics = [
        { icon: Package, label: 'Track Order', path: '/account/orders' },
        { icon: RefreshCcw, label: 'Returns' },
        { icon: HelpCircle, label: 'General FAQ' }
    ];

    return (
        <div className={cn(
            "min-h-screen pt-24 pb-20 transition-colors duration-500",
            isUnlimitedMode ? "bg-[#F8F8F8]" : "bg-[#FDFBF7]"
        )}>
            {/* Background Decorative Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-stretch">

                    {/* Left Column: Visual & Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 relative rounded-[40px] overflow-hidden min-h-[500px] lg:min-h-auto shadow-2xl group"
                    >
                        {/* Image Background */}
                        <img
                            src={womenWithDog}
                            alt="Happy pet owner with dog"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        {/* Content Over Image */}
                        <div className="absolute inset-0 p-10 flex flex-col justify-between h-full">
                            <div className="space-y-6">
                                <Badge className="bg-[#FFCC00] text-black border-none px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                    We're here to help
                                </Badge>
                                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                                    Let's Paws <br /> and Chat!
                                </h1>
                                <p className="text-white/80 text-lg max-w-sm leading-relaxed font-medium">
                                    Our dedicated support team is ready to answer any questions about our products for you and your furry friend.
                                </p>
                            </div>

                            {/* Contact Info Pills */}
                            <div className="space-y-4 max-w-sm">
                                {contactInfo.map((info, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 + 0.3 }}
                                        className="flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-3xl hover:bg-white/20 transition-all cursor-pointer group/item"
                                    >
                                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-black font-bold shadow-lg transition-transform group-hover/item:scale-110", info.color)}>
                                            <info.icon className="w-5 h-5" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">{info.label}</p>
                                            <p className="text-white font-black text-sm md:text-base leading-none">{info.value}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 bg-white rounded-[40px] shadow-2xl p-8 md:p-12 flex flex-col border border-gray-100 relative overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            {submitStatus === 'success' ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-12"
                                >
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-900 mb-2">Pawsitively Done!</h2>
                                        <p className="text-gray-500 font-medium max-w-xs mx-auto">Your message has been delivered to our team. We'll get back to you within 24 hours.</p>
                                    </div>
                                    <Button
                                        onClick={() => setSubmitStatus(null)}
                                        className="rounded-full bg-black text-white hover:bg-gray-800 px-8"
                                    >
                                        Send another message
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col"
                                >
                                    <div className="mb-10">
                                        <h2 className="text-4xl font-black text-gray-900 mb-2">Send us a message</h2>
                                        <p className="text-gray-500 font-medium">Fill out the form below and we'll get back to you within 24 hours.</p>
                                    </div>

                                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 flex-1">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Your Name</label>
                                                <Input
                                                    name="from_name" // Required if using standard EmailJS templates
                                                    placeholder="John Doe"
                                                    className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FFCC00] transition-all"
                                                    value={formState.name}
                                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Pet's Name</label>
                                                <Input
                                                    name="pet_name"
                                                    placeholder="Sir Barks-a-Lot"
                                                    className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FFCC00] transition-all"
                                                    value={formState.petName}
                                                    onChange={(e) => setFormState({ ...formState, petName: e.target.value })}
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                            <Input
                                                name="user_email"
                                                type="email"
                                                placeholder="john@example.com"
                                                className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FFCC00] transition-all"
                                                value={formState.user_email}
                                                onChange={(e) => setFormState({ ...formState, user_email: e.target.value })}
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">How can we help?</label>
                                            <Textarea
                                                name="message"
                                                placeholder="Tell us about your issue..."
                                                className="min-h-[150px] rounded-3xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FFCC00] transition-all resize-none p-4"
                                                value={formState.message}
                                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={cn(
                                                    "w-full md:w-auto px-10 h-16 rounded-full font-black text-lg transition-all flex items-center gap-3 shadow-xl",
                                                    submitStatus === 'error'
                                                        ? "bg-red-500 text-white hover:bg-red-600"
                                                        : "bg-[#FFCC00] text-black hover:bg-[#FFB700] shadow-yellow-200"
                                                )}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        Sending...
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    </>
                                                ) : submitStatus === 'error' ? (
                                                    <>
                                                        Try Again
                                                        <AlertCircle className="w-5 h-5" />
                                                    </>
                                                ) : (
                                                    <>
                                                        Send Message
                                                        <Send className="w-5 h-5" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Common Topics:</p>
                            <div className="flex flex-wrap gap-3">
                                {topics.map((topic, index) => (
                                    <button
                                        key={index}
                                        onClick={() => topic.path && navigate(topic.path)}
                                        className="flex items-center gap-2 px-5 py-3 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 group"
                                    >
                                        <topic.icon className="w-4 h-4 text-[#FFCC00] group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-bold text-gray-700">{topic.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
