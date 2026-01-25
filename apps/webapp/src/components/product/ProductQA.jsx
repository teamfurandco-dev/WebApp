import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { MessageCircle, User, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const ProductQA = ({ productId }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await api.getQuestions(productId);
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setSubmitting(true);
    try {
      const question = await api.addQuestion(productId, newQuestion, user?.id);
      if (question) {
        setQuestions([question, ...questions]);
        setNewQuestion('');
        toast.success("Question posted successfully!");
      } else {
        toast.error("Please login to post a question");
      }
    } catch (error) {
      toast.error("Failed to post question");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-furco-yellow" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-sm">
        <h3 className="font-serif font-bold text-2xl mb-6">Have a question?</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea 
            placeholder="Type your question here..." 
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="min-h-[100px] border-black/10 focus-visible:ring-furco-yellow rounded-xl resize-none bg-gray-50"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={submitting || !newQuestion.trim()}
              className="rounded-full bg-black text-white hover:bg-furco-yellow hover:text-black font-bold"
            >
              {submitting ? 'Posting...' : 'Post Question'}
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No questions yet. Be the first to ask!
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{q.user_name}</span>
                      <span className="text-xs text-muted-foreground">{format(new Date(q.created_at), 'MMM d, yyyy')}</span>
                    </div>
                    <p className="font-medium text-lg">{q.question}</p>
                  </div>

                  {/* Answers */}
                  {q.answers && q.answers.length > 0 && (
                    <div className="pl-4 border-l-2 border-furco-yellow/30 space-y-4 mt-4">
                      {q.answers.map(a => (
                        <div key={a.id} className="bg-furco-yellow/5 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-furco-yellow-dark flex items-center gap-1">
                              <MessageCircle className="w-3 h-3 fill-current" />
                              {a.user_name}
                            </span>
                            <span className="text-xs text-muted-foreground">{format(new Date(a.created_at), 'MMM d, yyyy')}</span>
                          </div>
                          <p className="text-sm">{a.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductQA;
