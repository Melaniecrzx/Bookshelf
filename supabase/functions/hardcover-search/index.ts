import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const { query } = await req.json()

  const response = await fetch("https://api.hardcover.app/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": `Bearer ${Deno.env.get("HARDCOVER_API_KEY")}`
    },
    body: JSON.stringify({
  query: `
    query SearchBooks($query: String!) {
      search(query: $query, query_type: "Book") {
        results
      }
    }
  `,
  variables: { query }
})
  })

const data = await response.json()

if (data.errors) {
  return new Response(JSON.stringify({ error: data.errors }), {
    status: 500,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  })
}

const results = data.data.search.results

return new Response(JSON.stringify(results), {
  headers: { ...corsHeaders, "Content-Type": "application/json" }
})
})
