const API_BASE = "http://localhost:8080/api/maintenance"; // adjust if using the /admin/maintenance route

export async function getMaintenanceByCar(carId: number) {
    const res = await fetch(`${API_BASE}/car/${carId}`);
    if (!res.ok) throw new Error("Failed to fetch maintenance history");
    return res.json();
}

export async function createMaintenance(data: any) {
    const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create maintenance record");
    return res.json();
}

export async function updateMaintenance(id: number, data: any) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update maintenance record");
    return res.json();
}

export async function deleteMaintenance(id: number) {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete maintenance record");
}
