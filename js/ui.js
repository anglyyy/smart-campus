import { STATUSES, CONCERN_TYPES } from "./config.js";

const els = {
  form: document.getElementById("request-form"),
  studentName: document.getElementById("studentName"),
  concernType: document.getElementById("concernType"),
  description: document.getElementById("description"),
  message: document.getElementById("message"),
  searchBox: document.getElementById("searchBox"),
  statusFilter: document.getElementById("statusFilter"),
  list: document.getElementById("request-list"),
  syncBtn: document.getElementById("syncBtn"),
  failToggle: document.getElementById("failToggle"),
  netStatus: document.getElementById("netStatus"),
};

export function populateDropdowns() {
  els.concernType.innerHTML = CONCERN_TYPES
    .map(t => `<option value="${t}">${t}</option>`)
    .join("");

  els.statusFilter.innerHTML =
    `<option value="">All Statuses</option>` +
    STATUSES.map(s => `<option value="${s}">${s}</option>`).join("");
}

export function getFormData() {
  return {
    studentName: els.studentName.value,
    concernType: els.concernType.value,
    description: els.description.value,
  };
}

export function clearForm() {
  els.form.reset();
}

export function showMessage(text, type) {
  els.message.textContent = text;
  els.message.className = type; // "success" or "error"
}

export function showErrors(errors) {
  showMessage(errors.join(" "), "error");
}

export function renderRequests(requests, onStatusChange) {
  els.list.innerHTML = "";

  if (requests.length === 0) {
    els.list.innerHTML = "<li>No requests found.</li>";
    return;
  }

  requests.forEach(r => {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.textContent =
      `${r.id} | ${r.studentName} | ${r.concernType} | ` +
      `${new Date(r.dateOfRequest).toLocaleString()} | ${r.description}`;

    const select = document.createElement("select");
    STATUSES.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      opt.selected = s === r.status;
      select.appendChild(opt);
    });
    select.addEventListener("change", () => onStatusChange(r.id, select.value));

    li.append(info, select);
    els.list.appendChild(li);
  });
}

export function onSubmit(handler) {
  els.form.addEventListener("submit", e => {
    e.preventDefault();
    handler();
  });
}

export function onSearchChange(handler) {
  els.searchBox.addEventListener("input", handler);
  els.statusFilter.addEventListener("change", handler);
}

export function getSearchValues() {
  return { text: els.searchBox.value, status: els.statusFilter.value };
}

export function onSync(handler) {
  els.syncBtn.addEventListener("click", handler);
}

export function onFailToggle(handler) {
  els.failToggle.addEventListener("change", () => handler(els.failToggle.checked));
}

export function setSyncing(isBusy) {
  els.syncBtn.disabled = isBusy;
  els.syncBtn.textContent = isBusy ? "Syncing..." : "Sync to campus server";
}

export function showNetStatus(isOnline) {
  els.netStatus.textContent = isOnline
    ? "Online"
    : "Offline: viewing and submitting work locally. Syncing needs a connection.";
}