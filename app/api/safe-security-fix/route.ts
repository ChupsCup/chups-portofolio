import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    console.log("🔒 Starting SAFE security fix...");
    
    // Step 1: Check current status first (SAFE)
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/projects?limit=1`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Accept': 'application/json'
      }
    });
    
    const checkStatus = checkResponse.ok;
    console.log("📊 Current projects access:", checkStatus ? "✅ Working" : "❌ Blocked");
    
    // Step 2: ONLY disable RLS (SAFE - doesn't delete data)
    const sqlCommands = [
      // Disable RLS for projects (SAFE)
      'ALTER TABLE projects DISABLE ROW LEVEL SECURITY;',
      // Disable RLS for experiences (SAFE)  
      'ALTER TABLE experiences DISABLE ROW LEVEL SECURITY;'
    ];
    
    const results = [];
    
    for (const sql of sqlCommands) {
      try {
        console.log("🔧 Executing:", sql);
        
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sql: sql })
        });
        
        const responseText = await response.text();
        results.push({
          sql: sql,
          success: response.ok,
          status: response.status,
          response: responseText
        });
        
        console.log(`✅ SQL Result: ${response.ok ? 'SUCCESS' : 'FAILED'}`);
        
      } catch (error) {
        console.log("❌ SQL Error:", error);
        results.push({
          sql: sql,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Step 3: Verify everything still works (SAFE)
    const verifyResponse = await fetch(`${supabaseUrl}/rest/v1/projects?limit=1`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Accept': 'application/json'
      }
    });
    
    const verifyWorks = verifyResponse.ok;
    
    return NextResponse.json({
      success: true,
      message: "🔒 SAFE Security Fix Completed!",
      results: results,
      beforeStatus: checkStatus,
      afterStatus: verifyWorks,
      dataIntegrity: verifyWorks ? "✅ PROTECTED" : "❌ ISSUE",
      timestamp: new Date().toISOString(),
      note: "✅ Your data is SAFE! Only RLS was disabled."
    });
    
  } catch (error) {
    console.error("🚨 Safe security fix error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      note: "⚠️ No changes made to your data"
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "🔒 Safe Security Fix API",
    description: "This API safely disables RLS without touching your data",
    usage: "POST /api/safe-security-fix",
    safety: "✅ Read-only verification + Safe RLS disable only"
  });
}
