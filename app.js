const entries = JSON.parse(localStorage.getItem("budgetEntries")) || [
  { label: "Freelance project", amount: 450, type: "income" },
  { label: "Internet", amount: 45, type: "expense" }
];

const money = value => `$${value.toLocaleString()}`;
const save = () => localStorage.setItem("budgetEntries", JSON.stringify(entries));

function render() {
  const income = entries.filter(e => e.type === "income").reduce((sum, e) => sum + e.amount, 0);
  const expenses = entries.filter(e => e.type === "expense").reduce((sum, e) => sum + e.amount, 0);
  const balance = income - expenses;
  const goal = Number(document.querySelector("#goal").value || 1);

  document.querySelector("#income").textContent = money(income);
  document.querySelector("#expenses").textContent = money(expenses);
  document.querySelector("#balance").textContent = money(balance);
  document.querySelector("#progress").value = Math.min(100, Math.max(0, (balance / goal) * 100));
  document.querySelector("#entries").innerHTML = entries.map(entry => `
    <article class="entry">
      <span>${entry.label}</span>
      <strong class="${entry.type}">${entry.type === "expense" ? "-" : "+"}${money(entry.amount)}</strong>
    </article>
  `).join("");
}

document.querySelector("#entryForm").addEventListener("submit", event => {
  event.preventDefault();
  entries.unshift({
    label: document.querySelector("#label").value,
    amount: Number(document.querySelector("#amount").value),
    type: document.querySelector("#type").value
  });
  save();
  event.target.reset();
  render();
});

document.querySelector("#goal").addEventListener("input", render);
render();
