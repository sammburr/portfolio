import { hello } from "lib";

export default {
  async fetch(request: Request): Promise<Response> {

    const url = new URL(request.url);

    if (url.pathname === "/api/hello") {
      return Response.json({ message: hello("from the edge") });
    }

    return new Response(null, { status: 404 });
  }
}