import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Principal } from "@icp-sdk/core/principal";
import { useNavigate } from "@tanstack/react-router";
import { Edit2, Loader2, Plus, Trash2, Upload, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { ProductInput } from "../backend";
import { UserRole } from "../backend";
import { useActor } from "../hooks/useActor";
import {
  useAllProducts,
  useAllUsers,
  useAssignRole,
  useCreateProduct,
  useDeleteProduct,
  useIsAdmin,
  useUpdateProduct,
} from "../hooks/useQueries";
import type { ProductWithId } from "../types/product";
import { CLOTHING_TYPES, COLOURS, SIZES } from "../types/product";

const EMPTY_FORM: ProductInput = {
  name: "",
  brand: "",
  price: 0,
  description: "",
  clothingType: "Tops",
  imageUrl: "",
  sizes: [],
  availableColours: [],
  isForWomen: false,
  isForMen: false,
  isForKids: false,
  stock: 0n,
};

type AdminTab = "products" | "users";

function truncatePrincipal(p: string): string {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}...${p.slice(-4)}`;
}

function RoleBadge({ role }: { role: UserRole }) {
  if (role === UserRole.admin) {
    return (
      <Badge className="bg-foreground text-background text-[10px] tracking-widest uppercase rounded-none">
        Admin
      </Badge>
    );
  }
  if (role === UserRole.user) {
    return (
      <Badge
        variant="secondary"
        className="text-[10px] tracking-widest uppercase rounded-none"
      >
        User
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="text-[10px] tracking-widest uppercase rounded-none text-muted-foreground"
    >
      Guest
    </Badge>
  );
}

function UsersTab() {
  const { data: users, isLoading } = useAllUsers();
  const assignRole = useAssignRole();
  const [principalInput, setPrincipalInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.admin);

  const handleRoleChange = async (principal: Principal, newRole: UserRole) => {
    try {
      await assignRole.mutateAsync({ principal, role: newRole });
      toast.success("Role updated successfully");
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleAssignByPrincipal = async () => {
    if (!principalInput.trim()) {
      toast.error("Please enter a principal");
      return;
    }
    let parsed: Principal;
    try {
      parsed = Principal.fromText(principalInput.trim());
    } catch {
      toast.error("Invalid principal format");
      return;
    }
    try {
      await assignRole.mutateAsync({ principal: parsed, role: selectedRole });
      toast.success("Role assigned successfully");
      setPrincipalInput("");
    } catch {
      toast.error("Failed to assign role");
    }
  };

  return (
    <div className="space-y-8">
      {/* Assign by Principal Card */}
      <div className="border border-border p-6">
        <h2 className="font-serif text-lg mb-1">Assign Role by Principal</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Paste a user&rsquo;s principal ID and assign them a role directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={principalInput}
            onChange={(e) => setPrincipalInput(e.target.value)}
            placeholder="e.g. aaaaa-aa or rdmx6-jaaaa-aaaaa-aaadq-cai"
            className="flex-1 font-mono text-xs"
            data-ocid="users.input"
          />
          <Select
            value={selectedRole}
            onValueChange={(v) => setSelectedRole(v as UserRole)}
          >
            <SelectTrigger className="w-[140px]" data-ocid="users.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserRole.admin}>Admin</SelectItem>
              <SelectItem value={UserRole.user}>User</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleAssignByPrincipal}
            disabled={assignRole.isPending}
            data-ocid="users.submit_button"
          >
            {assignRole.isPending ? (
              <Loader2 className="animate-spin mr-2" size={14} />
            ) : null}
            Assign
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div>
        <h2 className="font-serif text-lg mb-4">Registered Users</h2>
        {isLoading ? (
          <div className="space-y-3" data-ocid="users.loading_state">
            {[1, 2, 3].map((k) => (
              <div key={k} className="h-14 bg-secondary animate-pulse" />
            ))}
          </div>
        ) : !users || users.length === 0 ? (
          <div
            className="border border-border py-16 text-center text-sm text-muted-foreground"
            data-ocid="users.empty_state"
          >
            <Users size={32} className="mx-auto mb-3 opacity-30" />
            <p>No users found.</p>
          </div>
        ) : (
          <div
            className="border border-border overflow-x-auto"
            data-ocid="users.table"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] tracking-widest uppercase">
                    Principal
                  </TableHead>
                  <TableHead className="text-[10px] tracking-widest uppercase">
                    Role
                  </TableHead>
                  <TableHead className="text-[10px] tracking-widest uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u, i) => {
                  const principalStr = u.principal.toString();
                  return (
                    <TableRow
                      key={principalStr}
                      data-ocid={`users.row.${i + 1}`}
                    >
                      <TableCell>
                        <span
                          className="font-mono text-xs text-muted-foreground"
                          title={principalStr}
                        >
                          {truncatePrincipal(principalStr)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={u.role} />
                      </TableCell>
                      <TableCell>
                        {u.role === UserRole.admin ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleRoleChange(u.principal, UserRole.user)
                            }
                            disabled={assignRole.isPending}
                            className="text-[10px] tracking-widest uppercase border border-muted-foreground/40 px-3 py-1.5 hover:border-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                            data-ocid={`users.secondary_button.${i + 1}`}
                          >
                            Remove Admin
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleRoleChange(u.principal, UserRole.admin)
                            }
                            disabled={assignRole.isPending}
                            className="text-[10px] tracking-widest uppercase border border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
                            data-ocid={`users.primary_button.${i + 1}`}
                          >
                            Make Admin
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: products, isLoading } = useAllProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const { actor } = useActor();

  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithId | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<ProductWithId | null>(null);
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  if (adminLoading) {
    return (
      <main
        className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 text-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="animate-spin mx-auto mb-4" size={32} />
        <p className="text-sm text-muted-foreground">Checking permissions…</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main
        className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 text-center"
        data-ocid="admin.error_state"
      >
        <p className="font-serif text-2xl mb-4">Access Denied</p>
        <p className="text-sm text-muted-foreground mb-8">
          Admin privileges required.
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="text-xs tracking-widest uppercase border border-foreground px-6 py-3"
        >
          Go Home
        </button>
      </main>
    );
  }

  const openAdd = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (p: ProductWithId) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      brand: p.brand,
      price: p.price,
      description: p.description,
      clothingType: p.clothingType,
      imageUrl: p.imageUrl,
      sizes: [...p.sizes],
      availableColours: [...p.availableColours],
      isForWomen: p.isForWomen,
      isForMen: p.isForMen,
      isForKids: p.isForKids,
      stock: p.stock,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    if (!actor) return;
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
      setUploadProgress(pct),
    );
    const ref = await actor.createFileReference({
      id: `product-img-${Date.now()}`,
      file: blob,
      name: file.name,
    });
    setUploadProgress(null);
    setForm((f) => ({ ...f, imageUrl: ref.file.getDirectURL() }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.brand) {
      toast.error("Name and brand are required");
      return;
    }
    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({
          id: editingProduct.id,
          input: form,
        });
        toast.success("Product updated");
      } else {
        await createMutation.mutateAsync(form);
        toast.success("Product created");
      }
      setModalOpen(false);
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Product deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleArrayItem = (key: "sizes" | "availableColours", val: string) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val)
        ? f[key].filter((x) => x !== val)
        : [...f[key], val],
    }));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <main
      className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10"
      data-ocid="admin.page"
    >
      {/* Tab switcher */}
      <div className="flex items-center gap-0 border-b border-border mb-8">
        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={`text-[10px] tracking-widest uppercase px-6 py-3 border-b-2 transition-colors ${
            activeTab === "products"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          data-ocid="admin.tab"
        >
          Products
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`text-[10px] tracking-widest uppercase px-6 py-3 border-b-2 transition-colors ${
            activeTab === "users"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          data-ocid="admin.tab"
        >
          Users
        </button>
      </div>

      {activeTab === "products" && (
        <>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl">Product Management</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {products?.length ?? 0} products
              </p>
            </div>
            <Button
              onClick={openAdd}
              className="flex items-center gap-2"
              data-ocid="admin.primary_button"
            >
              <Plus size={16} /> Add Product
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3" data-ocid="admin.loading_state">
              {["a", "b", "c", "d", "e", "f"].map((k) => (
                <div key={k} className="h-14 bg-secondary animate-pulse" />
              ))}
            </div>
          ) : (
            <div
              className="border border-border overflow-x-auto"
              data-ocid="admin.table"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px] tracking-widest uppercase">
                      Image
                    </TableHead>
                    <TableHead className="text-[10px] tracking-widest uppercase">
                      Name
                    </TableHead>
                    <TableHead className="text-[10px] tracking-widest uppercase">
                      Brand
                    </TableHead>
                    <TableHead className="text-[10px] tracking-widest uppercase">
                      Type
                    </TableHead>
                    <TableHead className="text-[10px] tracking-widest uppercase">
                      Gender
                    </TableHead>
                    <TableHead className="text-[10px] tracking-widest uppercase">
                      Price
                    </TableHead>
                    <TableHead className="text-[10px] tracking-widest uppercase">
                      Stock
                    </TableHead>
                    <TableHead className="text-[10px] tracking-widest uppercase">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(products ?? []).map((p, i) => (
                    <TableRow
                      key={p.id.toString()}
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell>
                        <img
                          src={
                            p.imageUrl ||
                            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=80&q=60"
                          }
                          alt={p.name}
                          className="w-10 h-12 object-cover bg-secondary"
                        />
                      </TableCell>
                      <TableCell className="text-sm font-medium max-w-[180px] truncate">
                        {p.name}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {p.brand}
                      </TableCell>
                      <TableCell className="text-xs">
                        {p.clothingType}
                      </TableCell>
                      <TableCell className="text-xs">
                        {[
                          p.isForWomen && "W",
                          p.isForMen && "M",
                          p.isForKids && "K",
                        ]
                          .filter(Boolean)
                          .join("/")}
                      </TableCell>
                      <TableCell className="text-sm">${p.price}</TableCell>
                      <TableCell className="text-sm">
                        {Number(p.stock)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(p)}
                            className="p-1.5 hover:bg-secondary transition-colors"
                            data-ocid={`admin.edit_button.${i + 1}`}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(p)}
                            className="p-1.5 hover:bg-secondary transition-colors text-destructive"
                            data-ocid={`admin.delete_button.${i + 1}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {activeTab === "users" && (
        <>
          <div className="mb-8">
            <h1 className="font-serif text-3xl">User Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage roles and permissions for registered users.
            </p>
          </div>
          <UsersTab />
        </>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="md:col-span-2">
              <Label className="text-[10px] tracking-widest uppercase">
                Name *
              </Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Product name"
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>

            <div>
              <Label className="text-[10px] tracking-widest uppercase">
                Brand *
              </Label>
              <Input
                value={form.brand}
                onChange={(e) =>
                  setForm((f) => ({ ...f, brand: e.target.value }))
                }
                placeholder="Brand name"
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>

            <div>
              <Label className="text-[10px] tracking-widest uppercase">
                Price ($)
              </Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    price: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="0"
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>

            <div>
              <Label className="text-[10px] tracking-widest uppercase">
                Stock
              </Label>
              <Input
                type="number"
                value={Number(form.stock)}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    stock: BigInt(Number.parseInt(e.target.value) || 0),
                  }))
                }
                placeholder="0"
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>

            <div>
              <Label className="text-[10px] tracking-widest uppercase">
                Clothing Type
              </Label>
              <select
                value={form.clothingType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, clothingType: e.target.value }))
                }
                className="mt-1 w-full border border-input bg-card text-sm px-3 py-2 outline-none"
                data-ocid="admin.select"
              >
                {CLOTHING_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <Label className="text-[10px] tracking-widest uppercase block mb-2">
                Gender
              </Label>
              <div className="flex gap-6">
                {(["isForWomen", "isForMen", "isForKids"] as const).map(
                  (key) => (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        id={key}
                        checked={form[key]}
                        onCheckedChange={(v) =>
                          setForm((f) => ({ ...f, [key]: Boolean(v) }))
                        }
                        data-ocid="admin.checkbox"
                      />
                      <Label htmlFor={key} className="text-sm cursor-pointer">
                        {key === "isForWomen"
                          ? "Women"
                          : key === "isForMen"
                            ? "Men"
                            : "Kids"}
                      </Label>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <Label className="text-[10px] tracking-widest uppercase block mb-2">
                Sizes
              </Label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleArrayItem("sizes", s)}
                    className={`text-xs px-3 py-1.5 border transition-colors ${
                      form.sizes.includes(s)
                        ? "bg-foreground text-primary-foreground border-foreground"
                        : "bg-card border-border hover:border-foreground"
                    }`}
                    data-ocid="admin.toggle"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <Label className="text-[10px] tracking-widest uppercase block mb-2">
                Colours
              </Label>
              <div className="flex flex-wrap gap-2">
                {COLOURS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleArrayItem("availableColours", c)}
                    className={`text-xs px-3 py-1.5 border transition-colors ${
                      form.availableColours.includes(c)
                        ? "bg-foreground text-primary-foreground border-foreground"
                        : "bg-card border-border hover:border-foreground"
                    }`}
                    data-ocid="admin.toggle"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <Label className="text-[10px] tracking-widest uppercase block mb-2">
                Image
              </Label>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <Input
                    placeholder="Image URL (or upload below)"
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, imageUrl: e.target.value }))
                    }
                    className="mb-2"
                    data-ocid="admin.input"
                  />
                  <label className="flex items-center gap-2 text-xs cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                    <Upload size={14} />
                    {uploadProgress !== null
                      ? `Uploading ${uploadProgress}%…`
                      : "Upload image file"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      data-ocid="admin.upload_button"
                    />
                  </label>
                </div>
                {form.imageUrl && (
                  <div className="relative">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-16 h-20 object-cover bg-secondary"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                      className="absolute -top-1 -right-1 bg-foreground text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <Label className="text-[10px] tracking-widest uppercase">
                Description
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Product description…"
                rows={3}
                className="mt-1"
                data-ocid="admin.textarea"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              data-ocid="admin.save_button"
            >
              {isPending ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : null}
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="admin.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.name}
              &rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin.confirm_button"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="animate-spin mr-2" size={14} />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
