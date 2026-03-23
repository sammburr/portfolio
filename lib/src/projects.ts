const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  // foreground
  white:  "\x1b[97m",
  cyan:   "\x1b[96m",
  yellow: "\x1b[93m",
  green:  "\x1b[92m",
  // background
  bgBlue: "\x1b[44m",
};

export class Project {
  title : string = "";
  subtitle : string = "";
  description : string = "";
  tags : ProjectTag[] = [];

  constructor(title : string, subtitle : string, description : string, tags : ProjectTag[])
  {
    this.title = title;
    this.subtitle = subtitle;
    this.description = description;
    this.tags = tags;
  }

  toString(): string {
    const WIDTH = 60;
    const stripAnsiLength = (s: string) =>
      s.replace(/\x1b\[[0-9;]*m/g, "").length;

    const pad = (s: string, width = WIDTH - 2) => {
      const visibleLen = stripAnsiLength(s);
      const padding = " ".repeat(Math.max(0, width - visibleLen));
      return `${C.dim}│${C.reset} ${s}${padding} ${C.dim}│${C.reset}`;
    };
    const divider = `${C.dim}├${"─".repeat(WIDTH)}┤${C.reset}`;
    const top =     `${C.dim}┌${"─".repeat(WIDTH)}┐${C.reset}`;
    const bottom =  `${C.dim}└${"─".repeat(WIDTH)}┘${C.reset}`;

    // Word wrap a string to fit within the box width
    const wrap = (text: string): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let current = "";
      for (const word of words) {
        if(word.search("\n") > 0) {
          let splitWord = word.split("\n");
          lines.push(current + " " + splitWord[0]);
          lines.push("");
          current = splitWord[1];
        }
        else if (stripAnsiLength((current + " " + word).trim()) > WIDTH - 2 ) {
          lines.push(current.trim());
          current = word;
        } else {
          current = (current + " " + word).trim();
        }
      }
      if (current) lines.push(current.trim());
      return lines;
    };

    const title    = `${C.bold}${C.cyan}${this.title}${C.reset}`;
    const subtitle = `${C.dim}${this.subtitle}${C.reset}`;
    const tags     = this.tags.map(t => `${C.green}[${C.bold}${t.title}${C.bold}]${C.reset}`).join(" ");

    return [
      top,
      pad(title),
      pad(subtitle),
      divider,
      ...wrap(this.description).map(line => pad(`${C.white}${line}${C.reset}`)),
      divider,
      ...wrap(tags).map(tag => pad(tag)),
      bottom,
    ].join("\n") + "\n";
  }
}

export class ProjectTag {
  title : string = "";
  color : string = "#ffffffff"

  constructor(title : string, color : string)
  {
    this.title = title;
    this.color = color;
  }
}

export const tags = {
  Elixir : new ProjectTag("Elixir", "#ffffffff"),
  Phx : new ProjectTag("Phoenix", "#ffffffff"),
  Flutter : new ProjectTag("Flutter", "#ffffffff"),
  Dart : new ProjectTag("Dart", "#ffffffff"),
  REST : new ProjectTag("REST-API", "#ffffffff"),
  PostgreSQL : new ProjectTag("PostgreSQL", "#ffffffff"),
  Docker : new ProjectTag("Docker", "#ffffffff"),
  CPP : new ProjectTag("C++", "#ffffffff"),
  Nix : new ProjectTag("Nix", "#ffffffff"),
  Firmware : new ProjectTag("Firmware", "#ffffffff"),
  Teensy : new ProjectTag("Teensy", "#ffffffff"),
  Websocket : new ProjectTag("Websocket", "#ffffffff"),
  Blackmagic : new ProjectTag("Blackmagic-Protocol", "#ffffffff"),
  OpenGL : new ProjectTag("OpenGL", "#ffffffff"),
  ImGui : new ProjectTag("ImGui", "#ffffffff"),
  Godot : new ProjectTag("Godot", "#ffffffff")
};

export const projects = {

  Q : new Project(
    "Q — Rundown Management System",
    "Broadcast / Live Events · PEL",
    `A real-time show rundown and timeline manager for live production teams, built as a direct alternative to tools like ShoFlo. Features a bidirectional timing engine with hard anchors, a live show mode with per-second updates broadcast across all connected clients, and a rehearsal mode using pseudo-time. Integrates with an external production database, supports WebAuthn/passkey auth, role-based access, and exposes a REST API with Server-Sent Events for external clients.`,
    [
      tags.Elixir,
      tags.Phx,
      tags.REST,
      tags.PostgreSQL,
      tags.Docker
    ]
  ),
  Upulator : new Project(
    "Upulator — LED Screen Calculator",
    "AV / Live Events · Universal Pixels",
    `A full-stack tool for planning LED screen installations — takes a physical space, a product database of tiles and processors, and outputs optimal layouts, resolutions, power consumption, and weight distribution. Exports directly to AutoCAD, Vectorworks, and PixlGrid3 via DXF, XML, and TOML. Built with a Flutter/BLoC frontend, Elixir/Phoenix backend, PostgreSQL, and a C++ DXF generation module. Deployed on Linux with Nix, Nginx, and Let's Encrypt.`,
    [
      tags.Elixir,
      tags.Phx,
      tags.Flutter,
      tags.Dart,
      tags.CPP,
      tags.PostgreSQL,
      tags.Nix
    ] 
  ),
  CameraRoutingInterface : new Project(
    "Camera Routing Interface",
    "Broadcast / Live Events · Commercial Product",
    `An embedded middleware device bridging physical touch buttons and a Blackmagic video router, letting video engineers route camera outputs to monitors quickly and intuitively. Runs on a Teensy 4.1, communicates with the router over Blackmagic's network protocol, and exposes a WebSocket-based web server for on-device debugging and configuration. Sold as a finished hardware product, built in partnership with a PCB designer.`,
    [
      tags.CPP,
      tags.Firmware,
      tags.Teensy,
      tags.Websocket,
      tags.Blackmagic
    ]
  ),
  OpenGLFractal : new Project(
    "OpenGL Fractal Renderer",
    "Personal project",
    `A real-time fractal renderer written from scratch in C++ using OpenGL for GPU-accelerated rendering and ImGui for an interactive parameter UI. Supports deep zoom and live manipulation of fractal parameters.
https://github.com/sammburr/almondBread`,
    [
      tags.CPP,
      tags.OpenGL,
      tags.ImGui
    ]
  ),
  Godot4FPSPlugin : new Project(
    "Godot FPS Character Controller",
    "Open source",
    `A reusable first-person character controller plugin for Godot 4, covering movement, camera handling, and common FPS mechanics. Published as an open source plugin and picked up by other developers in the Godot community.
https://github.com/sammburr/Basic-FPS-Player-GODOT-4.0`,
    [
      tags.Godot
    ]
  )

};