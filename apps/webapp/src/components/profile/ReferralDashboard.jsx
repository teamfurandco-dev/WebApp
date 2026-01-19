import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Users, Wallet, Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@fur-co/utils';

const ReferralDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getReferralStats(user.id);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch referral stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const copyCode = () => {
    if (stats?.referral_code) {
      navigator.clipboard.writeText(stats.referral_code);
      toast.success("Referral code copied!");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-furco-yellow" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-[#FDFBF7] p-8 md:p-12 rounded-[2.5rem] border border-stone-100 relative overflow-hidden">
         {/* Decorative Background */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-furco-yellow/10 rounded-full blur-3xl -z-0 translate-x-1/3 -translate-y-1/3" />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-serif font-bold mb-4">Refer & Earn</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            Share your unique code with friends. They get <span className="font-bold text-black">10% off</span> their first order, and you get <span className="font-bold text-black">₹500</span> in credits!
          </p>

          <div className="bg-white p-2 pl-6 rounded-full inline-flex items-center gap-4 shadow-lg border border-black/5">
            <span className="font-mono text-xl font-bold tracking-wider">{stats?.referral_code}</span>
            <Button 
              onClick={copyCode}
              className="rounded-full bg-black text-white hover:bg-furco-yellow hover:text-black font-bold h-12 px-6"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total_referrals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-furco-yellow">{formatPrice(stats?.total_earnings)}</div>
          </CardContent>
        </Card>
         <Card className="bg-gradient-to-br from-furco-yellow/20 to-transparent border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-black">Invite More</CardTitle>
             <Share2 className="h-4 w-4 text-black" />
          </CardHeader>
           <CardContent>
            <Button variant="outline" className="w-full bg-white/50 border-black/10 hover:bg-white">Share Link</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
         <CardContent>
           <div className="space-y-6">
             {stats?.referrals.length === 0 ? (
               <p className="text-muted-foreground">No referrals yet.</p>
             ) : (
               stats?.referrals.map((ref) => (
                 <div key={ref.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                   <div>
                     <p className="font-bold">{ref.user}</p>
                     <p className="text-xs text-muted-foreground">{ref.date}</p>
                   </div>
                   <div className="text-right">
                     <Badge variant={ref.status === 'Completed' ? 'default' : 'secondary'} className={ref.status === 'Completed' ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}>
                       {ref.status}
                     </Badge>
                     {ref.reward > 0 && <p className="text-sm font-bold mt-1 text-furco-yellow">+{formatPrice(ref.reward)}</p>}
                   </div>
                 </div>
               ))
             )}
           </div>
         </CardContent>
      </Card>
    </div>
  );
};

export default ReferralDashboard;
