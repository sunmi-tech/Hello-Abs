import { createClient } from "@supabase/supabase-js";

// 환경 변수에서 키 가져오기
// !는 값이 반드시 존재한다고 확신할때 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
