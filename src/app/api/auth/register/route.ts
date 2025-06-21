// to avoid cors policy
export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch("https://api.vidinfra.com/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  let data: any;

  try {
    data = JSON.parse(text);
  } catch (err) {
    return new Response("Invalid JSON from API", { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
