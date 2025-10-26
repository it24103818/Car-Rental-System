const API_BASE = "http://localhost:8080/api"; // adjust if needed

export async function getCars() {
    const res = await fetch(`${API_BASE}/cars`);
    if (!res.ok) throw new Error("Failed to fetch cars");
    return res.json();
}

export async function addBooking(data) {
    const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add booking");
    return res.json();
}
