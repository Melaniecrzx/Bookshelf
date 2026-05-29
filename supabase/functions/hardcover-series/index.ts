import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const { seriesId } = await req.json()

  const response = await fetch("https://api.hardcover.app/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": `Bearer ${Deno.env.get("HARDCOVER_API_KEY")}`
    },
    body: JSON.stringify({
  query: `
    query SeriesBooks($id: Int!) {
  series_by_pk(id: $id) {
    name
    book_series {
      position
      book {
        title
        image {
          url
        }
        pages
        release_year
      }
    }
  }
}

  `,
variables: { id: seriesId } })
  })

const data = await response.json()

if (data.errors) {
  return new Response(JSON.stringify({ error: data.errors }), {
    status: 500,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  })
}

const results = data.data.series_by_pk 

return new Response(JSON.stringify(results), {
  headers: { ...corsHeaders, "Content-Type": "application/json" }
})
})
