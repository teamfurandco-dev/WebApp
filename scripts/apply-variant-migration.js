#!/usr/bin/env node

/**
 * Database Migration Script for Variant System
 * Run this script to apply all database changes for the multi-category variant system
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Starting variant system migration...');

  try {
    // Read migration files
    const migrationSQL = readFileSync(join(__dirname, '../database/variant_system_migration.sql'), 'utf8');
    const rpcSQL = readFileSync(join(__dirname, '../database/rpc_functions.sql'), 'utf8');

    // Split SQL into individual statements
    const migrationStatements = migrationSQL.split(';').filter(stmt => stmt.trim());
    const rpcStatements = rpcSQL.split(';').filter(stmt => stmt.trim());

    console.log('📊 Applying schema migration...');
    
    // Execute migration statements
    for (const statement of migrationStatements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() });
        if (error) {
          console.error('Migration error:', error);
          throw error;
        }
      }
    }

    console.log('🔧 Creating RPC functions...');
    
    // Execute RPC statements
    for (const statement of rpcStatements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() });
        if (error) {
          console.error('RPC error:', error);
          throw error;
        }
      }
    }

    console.log('✅ Migration completed successfully!');
    
    // Test the RPC function
    console.log('🧪 Testing RPC function...');
    const { data: testProduct } = await supabase
      .from('products')
      .select('slug')
      .limit(1)
      .single();

    if (testProduct) {
      const { data: rpcResult, error: rpcError } = await supabase.rpc('get_product_details_by_slug', {
        product_slug: testProduct.slug
      });

      if (rpcError) {
        console.error('RPC test failed:', rpcError);
      } else {
        console.log('✅ RPC function working correctly');
        console.log('Sample result keys:', Object.keys(rpcResult || {}));
      }
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
