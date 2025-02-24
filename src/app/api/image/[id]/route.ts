import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "ID is required" },
      { status: 400, statusText: "ID is required" }
    );
  }

  const { data, error } = await supabase
    .from("images")
    .select("url")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Image not found" },
      { status: 404, statusText: "Image not found" }
    );
  }

  return NextResponse.json({ url: data.url });
}
