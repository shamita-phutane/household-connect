import { useState } from "react";
import { createService, updateService, deleteService } from "../../../api/servicesApi";

export default function ServicesManagement({ services, refreshServices }) {
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        svcName: "",
        category: "CLEANING",
        basePrice: 0,
        description: "",
        imageUrl: ""
    });

    function handleEdit(service) {
        setEditingId(service.serviceId);
        setFormData({
            svcName: service.svcName,
            category: service.category,
            basePrice: service.basePrice,
            description: service.description,
            imageUrl: service.imageUrl
        });
    }

    function handleNew() {
        setEditingId("NEW");
        setFormData({
            svcName: "",
            category: "CLEANING",
            basePrice: 0,
            description: "",
            imageUrl: ""
        });
    }

    async function handleSave(e) {
        e.preventDefault();
        try {
            if (editingId === "NEW") {
                await createService(formData);
            } else {
                await updateService(editingId, formData);
            }
            setEditingId(null);
            refreshServices();
        } catch (err) {
            console.error(err);
            alert("Failed to save service.");
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this service?")) return;
        try {
            await deleteService(id);
            refreshServices();
        } catch (err) {
            console.error(err);
            alert("Failed to delete service.");
        }
    }

    return (
        <div>
            <div style={{ marginBottom: "20px" }}>
                <button className="pay-btn" onClick={handleNew}>+ Add New Service</button>
            </div>

            {editingId && (
                <form onSubmit={handleSave} style={{ background: "var(--surface)", padding: "20px", borderRadius: "10px", marginBottom: "30px", border: "1px solid var(--border)" }}>
                    <h3>{editingId === "NEW" ? "Add New Service" : "Edit Service"}</h3>
                    <div style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
                        <input type="text" placeholder="Service Name" value={formData.svcName} onChange={e => setFormData({...formData, svcName: e.target.value})} required style={{ padding: "10px" }} />
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ padding: "10px" }}>
                            <option value="CLEANING">Cleaning</option>
                            <option value="APPLIANCE_REPAIR">Appliance Repair</option>
                            <option value="PLUMBING">Plumbing</option>
                            <option value="ELECTRICAL">Electrical</option>
                            <option value="CARPENTRY">Carpentry</option>
                            <option value="PAINTING">Painting</option>
                            <option value="BEAUTY_WELLNESS">Beauty/Wellness</option>
                            <option value="PEST_CONTROL">Pest Control</option>
                        </select>
                        <input type="number" placeholder="Base Price" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value)})} required style={{ padding: "10px" }} />
                        <input type="text" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required style={{ padding: "10px" }} />
                        <input type="text" placeholder="Image URL" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} required style={{ padding: "10px" }} />
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button type="submit" className="pay-btn">Save</button>
                            <button type="button" className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                        </div>
                    </div>
                </form>
            )}

            <div className="recent-bookings">
                {services.length === 0 ? (
                    <div className="empty-state">No services found.</div>
                ) : (
                    services.map(service => (
                        <div key={service.serviceId} className="booking-row" style={{ gridTemplateColumns: "2fr 1fr 1fr auto auto" }}>
                            <span><strong>{service.svcName}</strong><br/>{service.description}</span>
                            <span className="payment-tag">{service.category}</span>
                            <span><strong>₹{service.basePrice}</strong></span>
                            <button className="pay-btn" onClick={() => handleEdit(service)}>Edit</button>
                            <button className="cancel-btn" onClick={() => handleDelete(service.serviceId)}>Delete</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
