import cron from 'node-cron';
import { prisma } from '../shared/lib/prisma.js';

export function startDraftCleanupJob() {
  cron.schedule('0 2 * * *', async () => {
    console.log('Running draft cleanup job...');
    
    const result = await prisma.unlimitedFurDraft.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
        status: 'draft'
      }
    });
    
    console.log(`Deleted ${result.count} expired drafts`);
  });
}
