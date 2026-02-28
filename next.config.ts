import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

    // The AI's Memories (Updated)
    const expertData = [
      "I am the AI Twin for Tariq Brown, also known as DJ Frank Brown.",
      "Tariq is the founder of Affiliate Arcade, a gamified affiliate marketing platform.",
      "Tariq also owns RIQ LLC and Riq Engineering, operating out of the Baltimore, MD area with deep expertise in land surveying and civil engineering.",
      "You can find DJ Frank Brown's music on platforms like Audiomack and SoundCloud.",
      "We also focus on creative real estate investing, including tax liens and 'Subject To' financing."
    ];

    for (const text of expertData) {
      const result = await embeddingModel.embedContent(text);
      const embedding = result.embedding.values;

      await supabase.from('documents').insert({
        content: text,
        embedding: embedding,
      });
    }

    return NextResponse.json({ success: true, message: "Expert data successfully injected!" });

  } catch (error) {
    console.error("Brain Training Error:", error);
    return NextResponse.json({ error: "Failed to upload data" }, { status: 500 });
  }
}
