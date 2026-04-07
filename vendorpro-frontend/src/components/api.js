// src/api.js
export const BASE_URL = "https://vendorpro-vms-1.onrender.com";
// Get all vendors
export const getVendors = async () => {
  const res = await fetch(`${BASE_URL}/api/vendors`);
  return res.json();
};

// Add a new vendor
export const addVendor = async (vendor) => {
  const res = await fetch(`${BASE_URL}/api/vendors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vendor),
  });
  return res.json();
};

// Update an existing vendor
export const updateVendor = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/vendors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Delete a vendor
export const deleteVendor = async (id) => {
  const res = await fetch(`${BASE_URL}/api/vendors/${id}`, {
    method: "DELETE",
  });
  return res.json();
};