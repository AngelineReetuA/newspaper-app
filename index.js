let cats = [];
let articles = [];
let filtered = [];

let timeout;

const input = document
  .getElementById("searchIP")
  .addEventListener("input", (event) => {
    clearTimeout(timeout);
    const searchIP = event.target.value.trim();
    timeout = setTimeout(() => {
      if (searchIP === "") {
        showCards(articles);
      }
      filtered = articles.filter((item) => item.description.includes(searchIP));

      showCards(filtered);
    }, 500);
  });

fetch("http://localhost:3000/get-json")
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
  .then(async (jsonitems) => {
    const clearFilter = document.getElementById("clear");

    articles = jsonitems;

    jsonitems.forEach((item) => {
      if (
        item.title !== "" &&
        item.description !== "" &&
        item.link !== "" &&
        item.pubDate !== ""
      ) {
        cats.push(item.category);
      }
    });
    await showCards(articles);

    cats = new Set(cats);
    const drop = document.getElementById("drop");
    for (let cat of cats) {
      const li = document.createElement("li");
      li.classList.add("dropdown-item");
      li.appendChild(document.createTextNode(cat));
      drop.appendChild(li);
      li.addEventListener("click", async (event) => {
        let selectedOption = event.target.outerText;
        const filtered = articles.filter(
          (item) => item.category === selectedOption
        );
        console.log(filtered);
        await showCards(filtered);
        clearFilter.disabled = false;
        clearFilter.addEventListener("click", async () => {
          await showCards(articles);
          clearFilter.disabled = true;
        });
      });
    }
  });

function showCards(articles) {
  const container = document.querySelector(".grid-container");
  container.innerHTML = "";
  // title, description, link, pubDate, category
  articles.forEach((item) => {
    if (
      item.title !== "" &&
      item.description !== "" &&
      item.link !== "" &&
      item.pubDate !== ""
    ) {
      const card = document.createElement("div");
      card.classList.add("card", "my-3");

      card.innerHTML = `
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.description}</p>
                <a href="${
                  item.link
                }" class="link-primary" target="_blank">View article</a>
              </div>
              <div class="card-footer">
                <small>Published on ${item.pubDate.slice(5)}</small>
              </div>
            `;

      container.appendChild(card);
    }
  });
}
