#!/bin/bash

echo "🔍 Verifying Monorepo Structure..."
echo ""

# Check workspace structure
echo "✓ Checking workspace packages..."
if [ -d "apps/webapp" ] && [ -d "apps/admin" ] && [ -d "apps/backend" ]; then
    echo "  ✓ All apps present"
else
    echo "  ✗ Missing apps"
    exit 1
fi

if [ -d "packages/ui" ] && [ -d "packages/utils" ] && [ -d "packages/types" ] && [ -d "packages/config" ]; then
    echo "  ✓ All packages present"
else
    echo "  ✗ Missing packages"
    exit 1
fi

# Check key files
echo ""
echo "✓ Checking configuration files..."
[ -f "pnpm-workspace.yaml" ] && echo "  ✓ pnpm-workspace.yaml"
[ -f "turbo.json" ] && echo "  ✓ turbo.json"
[ -f "package.json" ] && echo "  ✓ Root package.json"
[ -f ".npmrc" ] && echo "  ✓ .npmrc"

# Check package.json files
echo ""
echo "✓ Checking package.json files..."
for pkg in apps/webapp apps/admin apps/backend packages/ui packages/utils packages/types packages/config; do
    if [ -f "$pkg/package.json" ]; then
        echo "  ✓ $pkg/package.json"
    else
        echo "  ✗ Missing $pkg/package.json"
    fi
done

# Check if node_modules exists
echo ""
if [ -d "node_modules" ]; then
    echo "✓ Dependencies installed"
else
    echo "⚠ Dependencies not installed. Run: pnpm install"
fi

echo ""
echo "🎉 Monorepo structure verification complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Run 'pnpm install' if not already done"
echo "  2. Set up environment variables in each app"
echo "  3. Run 'pnpm dev' to start all apps"
echo "  4. Visit:"
echo "     - Webapp: http://localhost:5173"
echo "     - Admin: http://localhost:3001"
echo "     - Backend: http://localhost:3000"
