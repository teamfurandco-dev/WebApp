# Unlimited Fur - Quick Start Guide

## 🚀 Getting Started

### 1. Database Migration

```bash
cd apps/backend
npx prisma migrate dev --name add_unlimited_fur_models
npx prisma generate
```

### 2. Start Backend

```bash
cd apps/backend
pnpm dev
```

The renewal cron job will start automatically and run daily at 6 AM.

### 3. Start Frontend

```bash
cd apps/webapp
pnpm dev
```

---

## 🧪 Testing the System

### Test Monthly Plan Flow

1. Navigate to `/unlimited` (landing page)
2. Click "Start Monthly Plan"
3. Select budget (e.g., ₹2,000)
4. Select pet type (Cat or Dog)
5. Select categories (e.g., Food, Toys)
6. Add products within budget
7. Watch wallet update in real-time
8. Proceed to checkout
9. Select address and payment method
10. Choose billing cycle day
11. Confirm and activate plan
12. View plan at `/unlimited-fur/monthly/my-plan`

### Test Bundle Flow

1. Navigate to `/unlimited` (landing page)
2. Click "Build a Bundle"
3. Select budget (e.g., ₹3,000)
4. Select pet type
5. Select categories
6. Add 3+ products (to get 15% discount)
7. Proceed to checkout
8. Verify 15% discount is applied
9. Complete checkout

---

## 🔍 Key URLs

### Landing & Entry Points
- `/unlimited` - Unlimited Fur landing page
- `/unlimited-fur/monthly/budget` - Start monthly plan
- `/unlimited-fur/bundle/budget` - Start bundle

### Monthly Plan Flow
- `/unlimited-fur/monthly/budget` - Budget selection
- `/unlimited-fur/monthly/pet-profile` - Pet type
- `/unlimited-fur/monthly/categories` - Categories
- `/unlimited-fur/monthly/shopping` - Shopping
- `/unlimited-fur/monthly/checkout` - Checkout
- `/unlimited-fur/monthly/my-plan` - Manage plan

### Bundle Flow
- `/unlimited-fur/bundle/budget` - Budget selection
- `/unlimited-fur/bundle/pet-profile` - Pet type
- `/unlimited-fur/bundle/categories` - Categories
- `/unlimited-fur/bundle/shopping` - Shopping
- `/unlimited-fur/bundle/checkout` - Checkout

---

## 🧪 API Testing with cURL

### Create Monthly Plan Draft
```bash
curl -X POST http://localhost:3000/api/unlimited-fur/monthly-plan/draft \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Set Budget
```bash
curl -X PUT http://localhost:3000/api/unlimited-fur/monthly-plan/PLAN_ID/budget \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"monthlyBudget": 200000}'
```

### Get Eligible Products
```bash
curl "http://localhost:3000/api/unlimited-fur/products?petType=cat&categories=food,toys&budget=200000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Active Plan
```bash
curl http://localhost:3000/api/unlimited-fur/monthly-plan/active \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🎯 Testing Checklist

### Monthly Plan
- [ ] Can create draft
- [ ] Can set budget (validates minimum ₹500)
- [ ] Can select pet type
- [ ] Can select categories
- [ ] Products filter correctly
- [ ] Can add products
- [ ] Wallet updates in real-time
- [ ] Cannot exceed budget
- [ ] Can remove products
- [ ] Can checkout and activate
- [ ] Plan appears in profile
- [ ] Can edit plan
- [ ] Can pause plan
- [ ] Can cancel plan

### Bundle
- [ ] Can create draft
- [ ] Can set budget
- [ ] Can select pet type
- [ ] Can select categories
- [ ] Products filter correctly
- [ ] Can add products
- [ ] 15% discount applies for 3+ products
- [ ] Can checkout
- [ ] Order created successfully

### Automatic Renewals
- [ ] Cron job starts with server
- [ ] Can manually trigger renewal
- [ ] Orders created for due plans
- [ ] Stock validated
- [ ] Next billing date updated

---

## 🐛 Common Issues & Solutions

### Issue: Products not showing
**Solution**: Ensure products have `unlimitedFurEligible = true` and correct `unlimitedFurPetTypes` in database.

### Issue: Budget validation failing
**Solution**: Budget must be in cents (₹1,000 = 100000 cents).

### Issue: Cron job not running
**Solution**: Check server logs. Ensure `node-cron` is installed.

### Issue: 404 on API endpoints
**Solution**: Verify routes are registered in `server.ts`.

### Issue: Wallet not updating
**Solution**: Check browser console for API errors. Verify JWT token is valid.

---

## 📊 Database Queries for Testing

### Check Active Plans
```sql
SELECT * FROM "MonthlyPlan" WHERE "planStatus" = 'active';
```

### Check Plans Due for Renewal
```sql
SELECT * FROM "MonthlyPlan" 
WHERE "planStatus" = 'active' 
AND "nextBillingDate" <= CURRENT_DATE;
```

### Check Monthly Plan Orders
```sql
SELECT * FROM "MonthlyPlanOrder" 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

### Check Bundle Orders
```sql
SELECT * FROM "OneTimeBundleOrder" 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

### Mark Products as Unlimited Fur Eligible
```sql
UPDATE "Product" 
SET 
  "unlimitedFurEligible" = true,
  "unlimitedFurPetTypes" = ARRAY['cat', 'dog'],
  "unlimitedFurMinBudget" = 50000
WHERE "categoryId" IN (
  SELECT id FROM "Category" WHERE slug IN ('food', 'toys', 'accessories')
);
```

---

## 🔧 Manual Renewal Testing

To manually test the renewal system without waiting for cron:

```javascript
// In Node.js REPL or test script
import { RenewalService } from './apps/backend/src/modules/unlimited-fur/renewal.service';

const renewalService = new RenewalService();
const results = await renewalService.processRenewals();
console.log(results);
```

---

## 📝 Sample Test Data

### Create Test Products
```sql
-- Insert test products for Unlimited Fur
INSERT INTO "Product" (id, name, slug, "categoryId", "isActive", "unlimitedFurEligible", "unlimitedFurPetTypes", "unlimitedFurMinBudget")
VALUES 
  (gen_random_uuid(), 'Premium Cat Food', 'premium-cat-food', 'CATEGORY_ID', true, true, ARRAY['cat'], 50000),
  (gen_random_uuid(), 'Dog Chew Toy', 'dog-chew-toy', 'CATEGORY_ID', true, true, ARRAY['dog'], 50000),
  (gen_random_uuid(), 'Pet Collar', 'pet-collar', 'CATEGORY_ID', true, true, ARRAY['cat', 'dog'], 50000);

-- Add variants
INSERT INTO "ProductVariant" (id, "productId", sku, name, price, stock, "isActive")
VALUES 
  (gen_random_uuid(), 'PRODUCT_ID', 'CAT-FOOD-001', '1kg Pack', 50000, 100, true),
  (gen_random_uuid(), 'PRODUCT_ID', 'DOG-TOY-001', 'Medium Size', 30000, 50, true),
  (gen_random_uuid(), 'PRODUCT_ID', 'COLLAR-001', 'Adjustable', 20000, 75, true);
```

---

## 🎉 Success Indicators

When everything is working correctly, you should see:

1. ✅ Landing page buttons navigate to budget selection
2. ✅ Budget selection validates and proceeds
3. ✅ Pet profile selection works
4. ✅ Category selection works
5. ✅ Products load and filter correctly
6. ✅ Wallet updates in real-time
7. ✅ Cannot add products over budget
8. ✅ Checkout shows correct totals
9. ✅ Plan activates successfully
10. ✅ Plan appears in profile
11. ✅ Cron job logs show in server console
12. ✅ Bundle discount applies correctly

---

## 📞 Support

For issues or questions:
1. Check server logs: `apps/backend/logs/`
2. Check browser console for frontend errors
3. Verify database schema is up to date
4. Ensure all environment variables are set
5. Check API responses in Network tab

---

## 🚀 Ready to Launch!

Your Unlimited Fur Subscription System is ready for testing and deployment. Follow this guide to verify all features work correctly before going live.

**Happy Testing!** 🎉
