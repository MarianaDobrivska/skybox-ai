import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase.from("images").select("*");

  if (error) {
    return NextResponse.json(
      { error: "Error fetching images" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
