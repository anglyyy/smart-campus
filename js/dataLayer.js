const STORAGE_KEY = "campusRequests";

export function getAllRequests() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveRequest(request) {
  const requests = getAllRequests();
  requests.push(request);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  return request;
}

export function updateRequest(updatedRequest) {
  const requests = getAllRequests();
  const index = requests.findIndex(r => r.id === updatedRequest.id);
  if (index === -1) return null;
  requests[index] = updatedRequest;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  return updatedRequest;
}

export function getRequestById(id) {
  return getAllRequests().find(r => r.id === id) || null;
}