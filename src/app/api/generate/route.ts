import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const client = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY || "",
    baseURL: "https://integrate.api.nvidia.com/v1",
  });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Require real auth for saving
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const body = await req.json();
    const { productName, description, features, targetMarket, price } = body;

    if (!productName || !description || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `
      You are an expert copywriter. Generate a high-converting landing page copy based on the following product details:
      
      Product Name: ${productName}
      Description: ${description}
      Features: ${features || "None provided"}
      Target Market: ${targetMarket || "General audience"}
      Price: ${price}

      Return ONLY a valid JSON object (no markdown, no code blocks, no extra text, no thinking) with this exact structure:
      {
        "headline": "A catchy, benefit-driven headline",
        "subheadline": "A compelling subheadline elaborating on the headline",
        "benefits": [
          { "title": "Benefit 1", "description": "Description of benefit 1" },
          { "title": "Benefit 2", "description": "Description of benefit 2" },
          { "title": "Benefit 3", "description": "Description of benefit 3" }
        ],
        "cta": "Primary Call to Action text (e.g. Get Started Now)"
      }
    `;

    // Call NVIDIA API
    let content = "";
    try {
      const completion = await client.chat.completions.create({
        model: "moonshotai/kimi-k2.5",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048,
        temperature: 0.7,
        stream: false,
      });
      content = completion.choices[0]?.message?.content || "{}";

      // Strip markdown code fences
      content = content.replace(/```json/g, "").replace(/```/g, "").trim();

      // Extract JSON object only
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
    } catch (aiError: any) {
      console.error("NVIDIA API error:", aiError);
      return NextResponse.json(
        { error: `Failed to generate AI content. ${aiError.message}` },
        { status: 500 }
      );
    }

    const parsedContent = JSON.parse(content);
    const pageId = crypto.randomUUID();

    // Save to Supabase using admin client (bypasses RLS to ensure save works if policies are tight)
    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase
      .from("sales_pages")
      .insert({
        id: pageId,
        user_id: user.id,
        product_name: productName,
        headline: parsedContent.headline,
        subheadline: parsedContent.subheadline,
        benefits: parsedContent.benefits,
        cta: parsedContent.cta,
        price: price,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: "Failed to save to database" }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id,
      success: true,
      data: {
        id: data.id,
        product_name: productName,
        headline: parsedContent.headline,
        subheadline: parsedContent.subheadline,
        benefits: parsedContent.benefits,
        cta: parsedContent.cta,
        price: price,
      },
    });

  } catch (error: any) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
