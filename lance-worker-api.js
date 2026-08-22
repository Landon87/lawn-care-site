// Lance AI API Worker
// Replaces the dead VPS backend - talks directly to Supabase

const SUPABASE_URL = 'https://duyrwxkbbdfucdvcljql.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1eXJ3eGtiYmRmdWNkdmNsanFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNjU1NzcsImV4cCI6MjA4Njk0MTU3N30.oVtZU0v1sZwfZRFNoKmCkkFtlEMQ8gIfXs4DkO3eujQ';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1eXJ3eGtiYmRmdWNkdmNsanFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM2NTU3NywiZXhwIjoyMDg2OTQxNTc3fQ.LX7mT7n0r0j0y0z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
  'Access-Control-Max-Age': '86400',
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  try {
    // Route handling
    if (path.startsWith('/api/auth/')) {
      return handleAuth(request, path);
    }
    
    if (path.startsWith('/api/customers')) {
      return handleCustomers(request, path);
    }
    
    if (path.startsWith('/api/admin/')) {
      return handleAdmin(request, path);
    }
    
    if (path === '/api/health') {
      return jsonResponse({ 
        status: 'ok', 
        service: 'lance-ai-api', 
        timestamp: new Date().toISOString() 
      });
    }

    // Default: proxy to Supabase REST API
    return proxyToSupabase(request);
    
  } catch (error) {
    console.error('Worker error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

// Auth handlers - forward to Supabase GoTrue
async function handleAuth(request, path) {
  const authPath = path.replace('/api/auth', '/auth/v1');
  const targetUrl = SUPABASE_URL + authPath;
  
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      ...getAuthHeaders(request),
    },
    body: request.method !== 'GET' ? await request.text() : undefined,
  });
  
  const data = await response.json().catch(() => ({}));
  return jsonResponse(data, response.status);
}

// Customer handlers
async function handleCustomers(request, path) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }
  
  // Verify user is authenticated
  const user = await getUser(authHeader);
  if (!user) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }
  
  if (request.method === 'GET') {
    // Fetch customers - filter by user role
    const isAdmin = user.user_metadata?.role === 'admin';
    
    let query = SUPABASE_URL + '/rest/v1/customers?select=*';
    
    // Non-admin users only see their own customer record
    if (!isAdmin && user.email) {
      query += '&email=eq.' + encodeURIComponent(user.email);
    }
    
    const response = await fetch(query, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json().catch(() => []);
    return jsonResponse(data, response.status);
  }
  
  return jsonResponse({ error: 'Method not allowed' }, 405);
}

// Admin handlers
async function handleAdmin(request, path) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }
  
  // Verify admin role
  const user = await getUser(authHeader);
  if (!user || user.user_metadata?.role !== 'admin') {
    return jsonResponse({ error: 'Forbidden - Admin only' }, 403);
  }
  
  if (path === '/api/admin/dashboard') {
    // Fetch dashboard stats
    const [customersRes, callsRes, messagesRes] = await Promise.all([
      fetch(SUPABASE_URL + '/rest/v1/customers?select=count', {
        headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': authHeader },
      }),
      fetch(SUPABASE_URL + '/rest/v1/calls?select=count', {
        headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': authHeader },
      }),
      fetch(SUPABASE_URL + '/rest/v1/messages?select=count', {
        headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': authHeader },
      }),
    ]);
    
    const customers = await customersRes.json().catch(() => [{ count: 0 }]);
    const calls = await callsRes.json().catch(() => [{ count: 0 }]);
    const messages = await messagesRes.json().catch(() => [{ count: 0 }]);
    
    return jsonResponse({
      totalCustomers: customers[0]?.count || 0,
      totalCalls: calls[0]?.count || 0,
      totalMessages: messages[0]?.count || 0,
      timestamp: new Date().toISOString(),
    });
  }
  
  if (path === '/api/admin/customers') {
    const response = await fetch(SUPABASE_URL + '/rest/v1/customers?select=*', {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': authHeader,
      },
    });
    
    const data = await response.json().catch(() => []);
    return jsonResponse(data, response.status);
  }
  
  if (path === '/api/admin/calls') {
    const response = await fetch(SUPABASE_URL + '/rest/v1/calls?select=*&order=created_at.desc&limit=100', {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': authHeader,
      },
    });
    
    const data = await response.json().catch(() => []);
    return jsonResponse(data, response.status);
  }
  
  return jsonResponse({ error: 'Not found' }, 404);
}

// Generic Supabase proxy
async function proxyToSupabase(request) {
  const url = new URL(request.url);
  const targetUrl = SUPABASE_URL + '/rest/v1' + url.pathname.replace('/api', '') + url.search;
  
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': request.headers.get('Authorization') || '',
      'Content-Type': request.headers.get('Content-Type') || 'application/json',
      'Prefer': request.headers.get('Prefer') || '',
    },
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
  });
  
  const data = await response.json().catch(() => ({}));
  return jsonResponse(data, response.status);
}

// Helper: Get current user from Supabase
async function getUser(authHeader) {
  try {
    const response = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': authHeader,
      },
    });
    
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    return null;
  }
}

// Helper: Get auth headers from request
function getAuthHeaders(request) {
  const headers = {};
  const auth = request.headers.get('Authorization');
  if (auth) headers['Authorization'] = auth;
  return headers;
}

// Helper: JSON response
function jsonResponse(data, status) {
  status = status || 200;
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}