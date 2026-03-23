import { projects } from "lib";

export default {
  async fetch(request: Request): Promise<Response> {

    const url = new URL(request.url);

    if (url.pathname === "/projects/q") {
      return new Response(
        projects.Q.toString(), 
        {
          headers: {"Content-Type": "text/plain"}
        }
      );
    }
    else if (url.pathname === "/projects/upulator") {
      return new Response(
        projects.Upulator.toString(), 
        {
          headers: {"Content-Type": "text/plain"}
        }
      );
    }
    else if (url.pathname === "/projects/camera-routing-interface") {
      return new Response(
        projects.CameraRoutingInterface.toString(), 
        {
          headers: {"Content-Type": "text/plain"}
        }
      );
    }
    else if (url.pathname === "/projects/fractal-renderer") {
      return new Response(
        projects.OpenGLFractal.toString(), 
        {
          headers: {"Content-Type": "text/plain"}
        }
      );
    }
    else if (url.pathname === "/projects/godot-fps-plugin") {
      return new Response(
        projects.Godot4FPSPlugin.toString(), 
        {
          headers: {"Content-Type": "text/plain"}
        }
      );
    }

    return new Response(null, { status: 404 });
  }
}