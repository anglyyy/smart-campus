let simulateFailure = false;

export function setSimulateFailure(value) {
  simulateFailure = value;
}

export function isSimulatingFailure() {
  return simulateFailure;
}

export function syncToServer(requests) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!navigator.onLine) {
        reject(new Error("OFFLINE"));
      } else if (simulateFailure) {
        reject(new Error("SERVER_DOWN"));
      } else {
        resolve({ synced: requests.length });
      }
    }, 800);
  });
}