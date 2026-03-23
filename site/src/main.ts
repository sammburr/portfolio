import { VectorfieldRenderer, projects, Project, ProjectTag } from "lib";
import gsap from "gsap";

var currentProject : Project = null;
var selectedTags : ProjectTag[] = [];

window.addEventListener("DOMContentLoaded", () => {

  console.log("Loaded DOM");

  currentProject = projects.Q;

  const projContentContainer = document.getElementById("proj-cont-container")! as HTMLDivElement;

  const canvas = document.getElementById("vectorfield-canvas")! as HTMLCanvasElement;
  new VectorfieldRenderer(canvas);

  for (let i = 0; i < Object.entries(projects).length; i++) {
    const project = Object.entries(projects)[i];
    const {
      main: main,
      tags: tags
    } = projectCard(project[1]);

    const projCard = document.createElement("div");
    projCard.className = "proj-card";
    projCard.dataset.projectKey = project[0];

    projCard.appendChild(main);
    projCard.appendChild(tags);

    if(project[1] != currentProject)
    {
      projCard.hidden = true;
    }

    projContentContainer.appendChild(projCard);

  }

  const navBar = document.createElement("div");
  navBar.id = "nav-bar";

  projContentContainer.appendChild(navBar);

  for (let i = 0; i < Object.entries(projects).length; i++) {
    const project = Object.keys(projects)[i];
    navBar.appendChild(navBall(project));
  }

  document.querySelector<HTMLElement>(`.nav-ball[data-project="Q"] circle`)?.setAttribute("fill", "black");

  // const keys = Object.keys(projects);
  // const testBtn = Object.assign(document.createElement("button"), {
  //   textContent: "Next Project",
  //   style: "position:fixed;top:10px;right:10px;z-index:999;padding:8px 16px;cursor:pointer;",
  // });
  // testBtn.addEventListener("click", () => {
  //   const currentIdx = keys.findIndex(k => (projects as Record<string, Project>)[k] === currentProject);
  //   const nextKey = keys[(currentIdx + 1) % keys.length];
  //   setCurrentProject(nextKey);
  // });
  // projContentContainer.appendChild(testBtn);

});


function setCurrentProject(key : string)
{
  const newProject = (projects as Record<string, Project>)[key];
  if (!newProject || newProject === currentProject) return;

  const cards = document.querySelectorAll<HTMLDivElement>(".proj-card");
  const ballNames = document.querySelectorAll<HTMLElement>(".ball-name");

  cards.forEach(card => {
    if (card.dataset.projectKey !== key) {
      card.hidden = true;
    } else {
      card.hidden = false;

      gsap.from(card.querySelector(".project-div")!, {
        opacity: 0,
        x: -80,
        duration: 0.7,
        ease: "power2.out",
      });

      gsap.from(card.querySelectorAll(".tag-cont"), {
        opacity: 0,
        x: -20,
        ease: "power2.out",
        stagger: 0.1
      });
    }
  });

  ballNames.forEach((ball => {

    if(ball.dataset.project == key) {
      ball.hidden = false;

      gsap.from(ball, {
        opacity: 0,
        x: -20,
        ease: "power2.out",
      })

    }
    else {
      ball.hidden = true;
    }
  }));

  document.querySelectorAll<HTMLElement>(".nav-ball").forEach(ball => {
    const circle = ball.querySelector("circle");
    circle?.setAttribute("fill", ball.dataset.project === key ? "black" : "#b9b9b9");
  });

  currentProject = newProject;
}

function projectCard(project : Project) : {main: HTMLElement, tags: HTMLElement}
{
  const el = document.createElement("div");
  el.className = "project-div";

  el.appendChild(Object.assign(document.createElement("div"), { textContent: project.title, className: "proj-title" }));
  el.appendChild(Object.assign(document.createElement("div"), { textContent: project.subtitle, className: "proj-sub" }));
  el.appendChild(Object.assign(document.createElement("div"), { textContent: project.description, className: "proj-descript" }));

  const tagEl = document.createElement("div");
  tagEl.className = "tags-div";

  for (let i = 0; i < project.tags.length; i++) {
    const tag = project.tags[i];
    const count = Object.values(projects).filter(p => p.tags.some(t => t.title === tag.title)).length;
    const tagCont = Object.assign(document.createElement("div"), { className: "tag-cont" });
    tagCont.innerHTML = `${tag.title} <span class="tag-count">x${count}</span>`;
    tagCont.dataset.tag = tag.title;
    tagCont.onclick = () => toggleTag(tagCont, tag, tagEl);

    tagEl.appendChild(tagCont);
  }

  return {
    main: el,
    tags: tagEl
    };
  }

function navBall(projectKey : string) : HTMLElement
{
  const elCont = document.createElement("span");
  elCont.onclick = () => setCurrentProject(projectKey);
  elCont.dataset.project = projectKey;


  elCont.className = "nav-ball";

  const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  

  el.setAttribute("width", "10");
  el.setAttribute("height", "10");

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "5");
  circle.setAttribute("cy", "5");
  circle.setAttribute("r", "5");
  circle.setAttribute("fill", "#b9b9b9");
  el.appendChild(circle);

  elCont.appendChild(el);
  const ballName = document.createElement("span");
  ballName.className = "ball-name";
  ballName.dataset.project = projectKey;
  ballName.innerText = projects[projectKey].title;

  ballName.hidden = projects[projectKey] == currentProject ? false : true;

  elCont.appendChild(ballName);

  return elCont;
}

function toggleTag(tagElement : HTMLElement, tag : ProjectTag, tagsDiv : HTMLElement)
{
  tagElement.classList.toggle("selected-tag-cont");

  if(tagElement.classList.contains("selected-tag-cont"))
  {
    selectedTags.push(tag);
  }
  else
  {
    selectedTags.splice(selectedTags.indexOf(tag), 1);
  }

  // Apply to all instances of this tag across all project cards
  const isSelected = tagElement.classList.contains("selected-tag-cont");
  document.querySelectorAll<HTMLElement>(".tag-cont").forEach(el => {
    if (el.dataset.tag === tag.title) {
      el.classList.toggle("selected-tag-cont", isSelected);
    }
  });


  // Hide nav balls whose project doesn't contain all selected tags
  document.querySelectorAll<HTMLElement>(".nav-ball").forEach(ball => {
    const key = ball.dataset.project;
    const project = (projects as Record<string, Project>)[key!];
    if (!project) return;

    const hasAllTags = selectedTags.length === 0 || selectedTags.every(
      st => project.tags.some(pt => pt.title === st.title)
    );
    ball.style.display = hasAllTags ? "" : "none";
  });
}

