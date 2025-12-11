// apps/web/src/lib/__mocks__/supabaseClient.ts
// This file mocks our custom supabaseClient.ts wrapper
import { createClient } from '@supabase/supabase-js';

// We can reuse the mockCreateClient from the @supabase/supabase-js mock
// However, since we're mocking the entire module, we can just define the
// exported `supabase` object directly.

// We need to provide dummy values for the URL and Key because createClient expects them,
// even though in the mock it won't actually use them.
export const supabase = createClient('MOCKED_SUPABASE_URL', 'MOCKED_SUPABASE_ANON_KEY');
