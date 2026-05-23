document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");

  style.innerHTML = `
    .card {
      border-radius: 16px;
      overflow: hidden;
      padding: 0 !important;
    }

    .card h2 {
      margin: 0;
      padding: 16px;
      background: #ffffff;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      border-bottom: 1px solid #e2e8f0;
    }

    .card h2::after {
      content: "▼";
      font-size: 13px;
      transition: .2s;
    }

    .card.closed h2::after {
      transform: rotate(-90deg);
    }

    .card-content {
      padding: 14px;
    }

    .card.closed .card-content {
      display: none;
    }
  `;

  document.head.appendChild(style);

  document.querySelectorAll(".card").forEach((card, index) => {
    const title = card.querySelector("h2");
    if (!title) return;

    const wrapper = document.createElement("div");
    wrapper.className = "card-content";

    while (title.nextSibling) {
      wrapper.appendChild(title.nextSibling);
    }

    card.appendChild(wrapper);

    if (index !== 0) {
      card.classList.add("closed");
    }

    title.addEventListener("click", () => {
      card.classList.toggle("closed");
    });
  });
});
