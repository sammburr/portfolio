(() => {
  // ../lib/src/index.ts
  function hello(name) {
    return `Hello, ${name}!`;
  }

  // src/main.ts
  document.getElementById("app").textContent = hello("World");
})();
