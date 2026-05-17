const demoEntries = [
  { label: "Freelance dashboard", amount: 650, type: "income", category: "Freelance" },
  { label: "Part-time salary", amount: 900, type: "income", category: "Salary" },
  { label: "Groceries", amount: 180, type: "expense", category: "Food" },
  { label: "Online course", amount: 75, type: "expense", category: "Learning" },
  { label: "Transport", amount: 60, type: "expense", category: "Transport" }
];

let entries = JSON.parse(localStorage.getItem("budgetEntriesV2")) || demoEntries.slice(0, 2);

const money = value => `$${value.toLocaleString()}`;
const save = () => localStorage.setItem("budgetEntriesV2", JSON.stringify(entries));

function totals() {
  const income = entries.filter(e => e.type === "income").reduce((sum, e) => sum + e.amount, 0);
  const expenses = entries.filter(e => e.type === "expense").reduce((sum, e) => sum + e.amount, 0);
  return { income, expenses, balance: income - expenses };
}

function topSpendCategory() {
  const spend = {};
  entries.filter(e => e.type === "expense").forEach(entry => {
    spend[entry.category] = (spend[entry.category] || 0) + entry.amount;
  });
  const winner = Object.entries(spend).sort((a, b) => b[1] - a[1])[0];
  return winner ? `${winner[0]} (${money(winner[1])})` : "None";
}

function render() {
  const { income, expenses, balance } = totals();
  const goal = Number(document.querySelector("#goal").value || 1);
  const progress = Math.min(100, Math.max(0, (balance / goal) * 100));
  const health = expenses === 0 ? "Excellent" : income / expenses > 2 ? "Strong" : income > expenses ? "Stable" : "Needs attention";

  document.querySelector("#income").textContent = money(income);
  document.querySelector("#expenses").textContent = money(expenses);
  document.querySelector("#balance").textContent = money(balance);
  document.querySelector("#progress").value = progress;
  document.querySelector("#goalMessage").textContent = `${Math.round(progress)}% of ${money(goal)} savings goal reached.`;
  document.querySelector("#topCategory").textContent = topSpendCategory();
  document.querySelector("#health").textContent = health;

  document.querySelector("#entries").innerHTML = entries.length ? entries.map((entry, index) => `
    <article class="entry">
      <div>
        <strong>${entry.label}</strong>
        <small>${entry.category} - ${entry.type}</small>
      </div>
      <strong class="${entry.type}">${entry.type === "expense" ? "-" : "+"}${money(entry.amount)}</strong>
      <button class="delete" data-index="${index}">Delete</button>
    </article>
  `).join("") : "<p>No budget entries yet.</p>";
}

document.querySelector("#entryForm").addEventListener("submit", event => {
  event.preventDefault();
  entries.unshift({
    label: document.querySelector("#label").value,
    amount: Number(document.querySelector("#amount").value),
    type: document.querySelector("#type").value,
    category: document.querySelector("#category").value
  });
  save();
  event.target.reset();
  render();
});

document.querySelector("#entries").addEventListener("click", event => {
  const button = event.target.closest(".delete");
  if (!button) return;
  entries.splice(Number(button.dataset.index), 1);
  save();
  render();
});

document.querySelector("#goal").addEventListener("input", render);
document.querySelector("#seedDemo").addEventListener("click", () => {
  entries = demoEntries.slice();
  save();
  render();
});
document.querySelector("#clearAll").addEventListener("click", () => {
  entries = [];
  save();
  render();
});

render();
