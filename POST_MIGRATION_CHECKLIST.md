# Post-Migration Checklist

## ✅ Immediate Actions Required

### 1. Environment Variables
Set up `.env` files for each app:

**apps/webapp/.env**
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**apps/admin/.env**
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000
```

**apps/backend/.env**
```bash
DATABASE_URL=your_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
```

### 2. Test the Setup

```bash
# Install dependencies (if not done)
pnpm install

# Test each app individually
pnpm --filter webapp dev
pnpm --filter admin dev
pnpm --filter backend dev

# Or run all together
pnpm dev
```

### 3. Verify Builds

```bash
# Build all apps
pnpm build

# Check for any build errors
```

### 4. Test Deployment

```bash
# Test GitHub Pages deployment
pnpm deploy
```

## 🔄 Migration Changes Summary

### What Changed
- ✅ Project restructured into monorepo with apps/ and packages/
- ✅ Shared code extracted into reusable packages
- ✅ All imports updated to use workspace packages
- ✅ New admin dashboard created
- ✅ Turborepo configured for efficient builds
- ✅ pnpm workspaces configured

### What Stayed the Same
- ✅ All webapp functionality preserved
- ✅ Backend API unchanged
- ✅ Database scripts at root level
- ✅ GitHub Pages deployment still works
- ✅ Supabase integration intact

## 🐛 Known Issues & Solutions

### Issue 1: esbuild postinstall warning
**Symptom**: Warning about esbuild version mismatch during `pnpm install`

**Solution**: This is expected and doesn't affect functionality. The `.npmrc` file handles it.

### Issue 2: Import errors after migration
**Symptom**: Cannot find module '@fur-co/utils' or similar

**Solution**: 
```bash
# Reinstall dependencies
pnpm install

# If still failing, try
rm -rf node_modules pnpm-lock.yaml
pnpm install --ignore-scripts
```

### Issue 3: Vite not finding shared packages
**Symptom**: Vite dev server fails to resolve workspace packages

**Solution**: Restart the dev server. Vite needs to rebuild after workspace changes.

## 📚 Common Commands

```bash
# Development
pnpm dev                          # Run all apps
pnpm --filter webapp dev          # Run only webapp
pnpm --filter admin dev           # Run only admin
pnpm --filter backend dev         # Run only backend

# Building
pnpm build                        # Build all apps
pnpm --filter webapp build        # Build only webapp

# Adding Dependencies
pnpm --filter webapp add react-query    # Add to webapp
pnpm --filter admin add axios           # Add to admin
pnpm add -w eslint                      # Add to root (workspace)

# Workspace Commands
pnpm -r exec <command>            # Run command in all packages
pnpm -r update                    # Update all packages
```

## 🎯 Next Development Steps

1. **Expand Shared UI Package**
   - Move more components from webapp to @fur-co/ui
   - Add Card, Input, Badge, and other shadcn components

2. **Implement Admin Features**
   - Connect admin to backend API
   - Build product management interface
   - Add order management
   - Implement user management

3. **Add Testing**
   - Set up Vitest for unit tests
   - Add E2E tests with Playwright
   - Configure test pipeline in Turborepo

4. **Set Up CI/CD**
   - GitHub Actions for automated testing
   - Automated deployment on merge to main
   - Preview deployments for PRs

5. **Add Linting & Formatting**
   - ESLint configuration in @fur-co/config
   - Prettier setup
   - Pre-commit hooks with husky

## 📖 Documentation

- **Root README.md**: Overview and quick start
- **MIGRATION_SUMMARY.md**: Detailed migration report
- **apps/webapp/README.md**: Webapp-specific docs
- **apps/admin/README.md**: Admin-specific docs
- **apps/backend/README.md**: Backend-specific docs

## 🆘 Getting Help

If you encounter issues:

1. Check this checklist first
2. Review MIGRATION_SUMMARY.md
3. Run `./verify-monorepo.sh` to check structure
4. Check pnpm logs: `pnpm install --loglevel debug`

## ✨ Success Indicators

You'll know the migration is successful when:

- ✅ `pnpm install` completes without critical errors
- ✅ `pnpm dev` starts all three apps
- ✅ Webapp loads at http://localhost:5173
- ✅ Admin loads at http://localhost:3001
- ✅ Backend responds at http://localhost:3000
- ✅ `pnpm build` completes successfully
- ✅ `pnpm deploy` deploys webapp to GitHub Pages
