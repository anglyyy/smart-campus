import { STATUSES, DEFAULT_STATUS, CONCERN_TYPES } from "./config.js";
import { getAllRequests, saveRequest, updateRequest } from "./dataLayer.js";
import { syncToServer } from "./serverApi.js";

export function validateRequest(input) {
  const errors = [];
  const name = (input.studentName || "").trim();
  const description = (input.description || "").trim();

  if (name === "") {
    errors.push("Student name is required.");
  } else if (!/^[A-Za-z\s.'-]+$/.test(name)) {
    errors.push("Student name may only contain letters and spaces.");
  }

  if (!CONCERN_TYPES.includes(input.concernType)) {
    errors.push("Please choose a valid type of concern.");
  }

  if (description === "") {
    errors.push("Description is required.");
  } else if (description.length < 10) {
    errors.push("Description must be at least 10 characters.");
  }

  return errors;
}

function generateId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `REQ-${stamp}-${random}`;
}

export function createRequest(input) {
  const errors = validateRequest(input);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  const request = {
    id: generateId(),
    studentName: input.studentName.trim(),
    concernType: input.concernType,
    description: input.description.trim(),
    dateOfRequest: new Date().toISOString(),
    status: DEFAULT_STATUS,
  };

  saveRequest(request);
  return { success: true, request };
}

export function changeStatus(id, newStatus) {
  if (!STATUSES.includes(newStatus)) {
    return { success: false, errors: ["Invalid status."] };
  }
  const request = getAllRequests().find(r => r.id === id);
  if (!request) {
    return { success: false, errors: ["Request not found."] };
  }
  request.status = newStatus;
  updateRequest(request);
  return { success: true, request };
}

export function searchRequests(searchText, statusFilter) {
  const text = (searchText || "").trim().toLowerCase();
  return getAllRequests().filter(r => {
    const matchesId = text === "" || r.id.toLowerCase().includes(text);
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesId && matchesStatus;
  });
}

export async function syncRequests() {
  try {
    const result = await syncToServer(getAllRequests());
    return { success: true, count: result.synced };
  } catch (err) {
    if (err.message === "OFFLINE") {
      return {
        success: false,
        errors: ["You are offline. Your requests are saved on this device and can be synced once you are back online."],
      };
    }
    return {
      success: false,
      errors: ["The campus server is not responding. Your data is safe on this device. Please try again later."],
    };
  }
}