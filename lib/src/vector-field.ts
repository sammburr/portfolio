const CLEAR_COLOR = "#ffffff";
const PIXELS_PER_SAMPLE = 50;
const SAMPLE_DENSITY = 20
const MAX_ARROW_LEN = 20;
const PARTICLE_T = 5;

interface vec2 {x: number, y: number};
interface attractor {mass: number, pos: vec2};
interface particle {pos: vec2, velocity: vec2, mass: number};

const length = (v: vec2) : number => {
  return Math.sqrt(
    (v.x * v.x) + (v.y * v.y)
  );
};

const normalise = (v : vec2) : vec2 => {
  const len = length(v);

  return {
    x: v.x/len,
    y: v.y/len
  }
};

export class VectorfieldRenderer
{


  canvas : HTMLCanvasElement;
  ctx : CanvasRenderingContext2D;


  sampleGrid : vec2[][] = [];
  samplesW : number = SAMPLE_DENSITY;
  samplesH : number = SAMPLE_DENSITY;

  mousePos : vec2 = {x:0, y:0};

  orbitAttractor1 : attractor = {
    mass: 2000,
    pos: {x: 0, y: 0}
  };

  orbitAttractor2 : attractor = {
    mass: 2000,
    pos: {x: 0, y: 0}
  };

  attractors : attractor[] = [
    {
      mass: -500,
      pos: {x: this.mousePos.x, y: this.mousePos.y}
    },
    this.orbitAttractor1,
    this.orbitAttractor2,
  ];

  particles : particle[] = [];
  NUM_PARTICLES = 200;

  constructor(canvas : HTMLCanvasElement)
  {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    window.addEventListener("resize", () => this.resizeCallback());
    this.resizeCallback();

    requestAnimationFrame((timestamp) => this.frame(timestamp));

    window.addEventListener("mousemove", (ev) => {
      this.mousePos.x = ev.clientX; 
      this.attractors[0].pos.x = this.mousePos.x;
      this.mousePos.y = ev.clientY;
      this.attractors[0].pos.y = this.mousePos.y;
    });

    this.buildSampleGrid();
    this.spawnParticles();

  }

  private buildSampleGrid()
  {
    this.samplesW = Math.max(2, Math.round(this.canvas.width / PIXELS_PER_SAMPLE));
    this.samplesH = Math.max(2, Math.round(this.canvas.height / PIXELS_PER_SAMPLE));

    this.sampleGrid = [];
    for (let x = 0; x < this.samplesW; x++) {
      this.sampleGrid.push([]);
      for (let y = 0; y < this.samplesH; y++) {
        this.sampleGrid[x].push({x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2});
      }
    }
  }

  private spawnParticles()
  {
    this.particles = [];
    for (let i = 0; i < this.NUM_PARTICLES; i++) {
      this.particles.push({
        pos: {
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height
        },
        velocity: {
          x: 0,// x: (Math.random() - 0.5) * 4,
          y: 0// y: (Math.random() - 0.5) * 4
        },
        mass: 500 + Math.random() * 4500
      });
    }
  }


  private clearCanvas(color : string = CLEAR_COLOR)
  {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }


  private resizeCallback()
  {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.buildSampleGrid();
    this.spawnParticles();
    this.clearCanvas();
  }


  private frame(timestamp : DOMHighResTimeStamp)
  {

    this.clearCanvas();

    const orbitRadius = Math.min(this.canvas.width, this.canvas.height) * 0.5;

    this.orbitAttractor1.pos.x = this.canvas.width / 2 + Math.cos(timestamp * 0.0005) * orbitRadius;
    this.orbitAttractor1.pos.y = this.canvas.height / 2 + Math.sin(timestamp * 0.0005) * orbitRadius;

    this.orbitAttractor2.pos.x = this.canvas.width / 2 + Math.cos((timestamp + (Math.PI * 1/0.0005)) * 0.0005) * orbitRadius;
    this.orbitAttractor2.pos.y = this.canvas.height / 2 + Math.sin((timestamp + (Math.PI * 1/0.0005)) * 0.0005) * orbitRadius;

    const pixelsPerSample = {x: this.canvas.width / this.samplesW, y: this.canvas.height / this.samplesH };

    for (let i = 0; i < this.sampleGrid.length; i++) {
      const row = this.sampleGrid[i];
      for (let j = 0; j < row.length; j++) {
        
        
        const sumForces = this.sumAttractors({x: i * pixelsPerSample.x + (pixelsPerSample.x / 2), y: j * pixelsPerSample.y + (pixelsPerSample.y / 2)});
        row[j] = sumForces;

        this.drawArrow(
          {
            x: sumForces.x, 
            y: sumForces.y
          }, 
          {x: i * pixelsPerSample.x + (pixelsPerSample.x / 2), y: j * pixelsPerSample.y + (pixelsPerSample.y / 2) }
        );
      }
    }

    for (let p = 0; p < this.particles.length; p++) {
      const part = this.particles[p];

      const si = Math.max(0, Math.min(this.samplesW - 1, Math.floor(part.pos.x / pixelsPerSample.x)));
      const sj = Math.max(0, Math.min(this.samplesH - 1, Math.floor(part.pos.y / pixelsPerSample.y)));
      const field = this.sampleGrid[si][sj];

      part.velocity.x += (field.x / part.mass) * PARTICLE_T;
      part.velocity.y += (field.y / part.mass) * PARTICLE_T;

      part.pos.x += part.velocity.x;
      part.pos.y += part.velocity.y;

      // Wrap around screen edges
      // if (part.pos.x < 0) part.pos.x += this.canvas.width;
      // if (part.pos.x > this.canvas.width) part.pos.x -= this.canvas.width;
      // if (part.pos.y < 0) part.pos.y += this.canvas.height;
      // if (part.pos.y > this.canvas.height) part.pos.y -= this.canvas.height;

      const size = Math.max(2, 6 - part.mass / 1000);
      this.ctx.fillStyle = "#b6dbdf";
      this.ctx.fillRect(part.pos.x - size / 2, part.pos.y - size / 2, size, size);
    }

    requestAnimationFrame((timestamp) => this.frame(timestamp));
  }


  private drawArrow(direction : vec2, position : vec2, color : string = "#c7c7c7")
  {

    var dirLen = length(direction);
    if(dirLen > MAX_ARROW_LEN) direction = {x: normalise(direction).x * MAX_ARROW_LEN, y: normalise(direction).y * MAX_ARROW_LEN };
    dirLen = length(direction);

    const endOfArrow = {
      x: position.x + direction.x,
      y: position.y + direction.y
    };

    const headLength = dirLen * 0.25;
    const angle = Math.atan2(direction.y, direction.x);
    const headAngle = Math.PI / 6;

    this.ctx.beginPath();

    this.ctx.strokeStyle = color;

    if(dirLen * 0.1 <= 0.2) return;

    this.ctx.lineWidth = dirLen * 0.1;

    this.ctx.moveTo(position.x, position.y);

    this.ctx.lineTo(endOfArrow.x, endOfArrow.y);

    this.ctx.lineTo(                                                                                                                                                                             
      endOfArrow.x - headLength * Math.cos(angle - headAngle),                                                                                                                              
      endOfArrow.y - headLength * Math.sin(angle - headAngle)                                                                                                                               
    );                                                                                                                                                                                      
    this.ctx.moveTo(endOfArrow.x, endOfArrow.y);
    this.ctx.lineTo(                                                                                                                                                                             
      endOfArrow.x - headLength * Math.cos(angle + headAngle),
      endOfArrow.y - headLength * Math.sin(angle + headAngle)                                                                                                                               
    );  

    this.ctx.stroke();

  }

  private sumAttractors(point : vec2) : vec2
  {

    var sumDir = {x: 0, y: 0};

    for (let i = 0; i < this.attractors.length; i++) {
      const attractor = this.attractors[i];

      const distance = Math.sqrt(
        (
          (attractor.pos.x - point.x) * (attractor.pos.x - point.x) +
          (attractor.pos.y - point.y) * (attractor.pos.y - point.y)
        )
      );

      var diff = {x: attractor.pos.x - point.x, y: attractor.pos.y - point.y};

      diff = normalise(diff);
      sumDir.x += diff.x * attractor.mass * (1/(distance));
      sumDir.y += diff.y * attractor.mass * (1/(distance));

    }

    if(length(sumDir) > 70) sumDir = {x: 0, y: 0};

    return sumDir;
  }

}
