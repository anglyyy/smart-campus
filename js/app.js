import * as ui from "./ui.js";
import { createRequest, changeStatus, searchRequests, syncRequests } from "./service.js";
import { setSimulateFailure } from "./serverApi.js";

function refreshList() {
  const { text, status } = ui.getSearchValues();
  const results = searchRequests(text, status);
  ui.renderRequests(results, handleStatusChange);
}

function handleSubmit() {
  const result = createRequest(ui.getFormData());
  if (!result.success) {
    ui.showErrors(result.errors);
    return;
  }
  ui.showMessage(`Request submitted! Your ID is ${result.request.id}`, "success");
  ui.clearForm();
  refreshList();
}

function handleStatusChange(id, newStatus) {
  const result = changeStatus(id, newStatus);
  if (result.success) {
    ui.showMessage(`Status updated to ${newStatus}.`, "success");
  } else {
    ui.showErrors(result.errors);
  }
  refreshList();
}

async function handleSync() {
  ui.setSyncing(true);
  const result = await syncRequests();
  ui.setSyncing(false);
  if (result.success) {
    ui.showMessage(`Synced ${result.count} request(s) to the campus server.`, "success");
  } else {
    ui.showErrors(result.errors);
  }
}

function updateNetStatus() {
  ui.showNetStatus(navigator.onLine);
}

// ---- startup ----
ui.populateDropdowns();
ui.onSubmit(handleSubmit);
ui.onSearchChange(refreshList);
ui.onSync(handleSync);
ui.onFailToggle(setSimulateFailure);
window.addEventListener("online", updateNetStatus);
window.addEventListener("offline", updateNetStatus);
updateNetStatus();
refreshList();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js")
    .then(() => console.log("Service worker registered"))
    .catch(err => console.error("Service worker failed:", err));
}