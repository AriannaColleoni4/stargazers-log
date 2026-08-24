const list = document.querySelector("#repository-list");
const count = document.querySelector("#repository-count");

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(dateString));
}

function formatStars(stars) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(stars);
}

function renderRepositories(events) {
  const repositories = events.filter((event) => event.type === "WatchEvent" && event.repo);
  count.textContent = `${repositories.length} ${repositories.length === 1 ? "repository" : "repositories"}`;

  if (repositories.length === 0) {
    list.innerHTML = '<p class="error-state">No starred repositories found.</p>';
    return;
  }

  list.innerHTML = repositories.map((event, index) => {
    const repository = event.repo;
    return `
      <article class="repository">
        <span class="repository-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
        <div>
          <a class="repository-name" href="${repository.url}" target="_blank" rel="noreferrer">${repository.name}</a>
          <p class="repository-description">${repository.description || "No description provided."}</p>
          <div class="repository-meta">
            <span>${repository.language || "Open source"}</span>
            <span>${formatStars(repository.stars)} stars</span>
          </div>
        </div>
        <time class="repository-date" datetime="${event.created_at}">${formatDate(event.created_at)}</time>
      </article>
    `;
  }).join("");
}

fetch("events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Could not load events.json (${response.status})`);
    }
    return response.json();
  })
  .then(renderRepositories)
  .catch((error) => {
    count.textContent = "Unavailable";
    list.innerHTML = `<p class="error-state">${error.message}. Serve this folder locally to load the log.</p>`;
  });