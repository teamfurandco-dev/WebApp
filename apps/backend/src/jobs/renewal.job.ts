import cron from 'node-cron';
import { RenewalService } from '../modules/unlimited-fur/renewal.service';

const renewalService = new RenewalService();

// Run daily at 6 AM
export const startRenewalJob = () => {
  cron.schedule('0 6 * * *', async () => {
    console.log('🔄 Running renewal job...');
    
    try {
      const results = await renewalService.processRenewals();
      
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      console.log(`✅ Renewal job completed: ${successful} successful, ${failed} failed`);
      
      if (failed > 0) {
        console.error('Failed renewals:', results.filter(r => !r.success));
      }
    } catch (error) {
      console.error('❌ Renewal job error:', error);
    }
  });
  
  console.log('📅 Renewal cron job scheduled (daily at 6 AM)');
};
