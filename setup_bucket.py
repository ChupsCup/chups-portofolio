#!/usr/bin/env python3
"""
Setup Supabase Storage Bucket
Menggunakan Supabase Management API untuk membuat bucket "portfolio"
"""

import requests
import json
import sys

# Supabase credentials
SUPABASE_URL = "https://oemaqbrvwbosbinjrxei.supabase.co"
PROJECT_ID = "oemaqbrvwbosbinjrxei"
SERVICE_ROLE_KEY = "sbp_c5ed6ba941156ee12f5d60fb56da8edbef167808"

def setup_bucket():
    """Setup storage bucket menggunakan Supabase Management API"""
    
    print("🚀 Starting Supabase Storage setup...\n")
    
    # Endpoint untuk create bucket
    url = f"{SUPABASE_URL}/storage/v1/bucket"
    
    headers = {
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "name": "portfolio",
        "public": True,
    }
    
    print(f"📦 Creating bucket 'portfolio'...")
    print(f"URL: {url}")
    print(f"Headers: {json.dumps({k: v[:20] + '...' if len(v) > 20 else v for k, v in headers.items()}, indent=2)}")
    print(f"Payload: {json.dumps(payload, indent=2)}\n")
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}\n")
        
        if response.status_code == 200:
            print("✅ Bucket 'portfolio' created successfully!")
            return True
        elif response.status_code == 400:
            data = response.json()
            if "already exists" in data.get("message", ""):
                print("✅ Bucket 'portfolio' already exists!")
                return True
            else:
                print(f"❌ Error: {data.get('message', 'Unknown error')}")
                return False
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error: {e}")
        return False

if __name__ == "__main__":
    success = setup_bucket()
    sys.exit(0 if success else 1)

