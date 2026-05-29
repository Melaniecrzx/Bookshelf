import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const { books } = await req.json()

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
     model: "claude-sonnet-4-5",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Voici les livres lus par cet utilisateur avec leurs notes :
${books.map((b: any) => `- ${b.title} par ${b.author} (${b.rating}/5)`).join("\n")}

Suggère 5 livres qu'il pourrait aimer.
Réponds uniquement en JSON sans backticks :
[{ "title": "", "author": "", "reason": "" }]`
      }]
    })
  })

const data = await response.json()
console.log('Full response status:', response.status)
console.log('Claude data:', JSON.stringify(data))

if (!data.content || !data.content[0]) {
  return new Response(JSON.stringify({ error: data }), {
    status: 500,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  })
}  const text = data.content[0].text
  const recommendations = JSON.parse(text)

  return new Response(JSON.stringify(recommendations), {
  headers: { 
    ...corsHeaders, 
    "Content-Type": "application/json" 
  }
})
})