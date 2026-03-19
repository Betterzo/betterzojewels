"use client";
import { useEffect, useState } from "react";
import { getAddresses, createAddress, updateAddress, deleteAddress } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import Swal from 'sweetalert2';

interface Address {
  id?: number;
  name: string;
  phone: string;
  email: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default?: number;
  type?: string;
}

interface AddressModuleProps {
  onSelect?: (address: Address) => void;
  editable?: boolean; // If true, allow add/edit/delete
  selectedId?: number | null;
  selectOnly?: boolean; // If true, only allow selection to do yes
}

export default function AddressModule({ onSelect, editable = true, selectedId, selectOnly = false }: AddressModuleProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Address>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [selectId, setSelectId] = useState<number | null>(selectedId || null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (e) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateAddress(editId, form);
        toast.success("Address updated");
      } else {
        console.log("form",form);
        await createAddress(form);
        toast.success("Address added");
      }
      setShowForm(false);
      setForm({});
      setEditId(null);
      fetchAddresses();
    } catch (e) {
      console.log("e",e);
      toast.error("Failed to save address");
    }
  };

  const handleEdit = (address: Address) => {
    setForm(address);
    setEditId(address.id!);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this address?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;
    try {
      await deleteAddress(id);
      toast.success("Address deleted");
      fetchAddresses();
    } catch (e) {
      toast.error("Failed to delete address");
    }
  };

  const handleSelect = (address: Address) => {
    setSelectId(address.id!);
    onSelect?.(address);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Addresses</h2>
        {editable && (
          <Button size="sm" onClick={() => { setShowForm(true); setForm({}); setEditId(null); }}>
            Add Address
          </Button>
        )}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : addresses.length === 0 ? (
        <div className="text-gray-500 flex flex-col gap-2">
          <p>No addresses found.</p>
          {editable && (
            <Button size="sm" variant="outline" onClick={() => { setShowForm(true); setForm({}); setEditId(null); }}>
              Add Your First Address
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map(addr => (
            <Card key={addr.id} className={selectId === addr.id ? "border-emerald-600 border-2" : ""}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">{addr.name} <span className="text-xs text-gray-500">({addr.type})</span></CardTitle>
                <Button size="sm" variant={selectId === addr.id ? "default" : "outline"} onClick={() => handleSelect(addr)}>
                  {selectId === addr.id ? "Selected" : "Select"}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <div>{addr.address_line_1}{addr.address_line_2 && ", " + addr.address_line_2}</div>
                  <div>{addr.city}, {addr.state} {addr.zip}, {addr.country}</div>
                  <div>Phone: {addr.phone}</div>
                  <div>Email: {addr.email}</div>
                </div>
                {!selectOnly && editable && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(addr)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(addr.id!)}>Delete</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Modal for Add/Edit Address */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Address" : "Add Address"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddOrUpdate} className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Name</Label>
                <Input name="name" value={form.name || ""} onChange={handleFormChange} required />
              </div>
              <div>
                <Label>Phone</Label>
                <Input name="phone" value={form.phone || ""} onChange={handleFormChange} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input name="email" value={form.email || ""} onChange={handleFormChange} required />
              </div>
              <div>
                <Label>Type</Label>
                <Input name="type" value={form.type || "shipping"} onChange={handleFormChange} required />
              </div>
            </div>
            <div>
              <Label>Address Line 1</Label>
              <Input name="address_line_1" value={form.address_line_1 || ""} onChange={handleFormChange} required />
            </div>
            <div>
              <Label>Address Line 2</Label>
              <Input name="address_line_2" value={form.address_line_2 || ""} onChange={handleFormChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <Label>City</Label>
                <Input name="city" value={form.city || ""} onChange={handleFormChange} required />
              </div>
              <div>
                <Label>State</Label>
                <Input name="state" value={form.state || ""} onChange={handleFormChange} required />
              </div>
              <div>
                <Label>ZIP</Label>
                <Input name="zip" value={form.zip || ""} onChange={handleFormChange} required />
              </div>
            </div>
            <div>
              <Label>Country</Label>
              <Input name="country" value={form.country || ""} onChange={handleFormChange} required />
            </div>
            <DialogFooter className="flex gap-2 mt-2">
              <Button type="submit" size="sm">{editId ? "Update" : "Add"} Address</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => { setShowForm(false); setForm({}); setEditId(null); }}>Cancel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
