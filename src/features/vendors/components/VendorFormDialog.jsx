import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VENDOR_CATEGORIES, VENDOR_STATUSES } from "@/features/vendors/constants"
import { useSaveVendor } from "@/features/vendors/hooks"

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().optional(),
  gstNo: z.string().optional(),
  email: z.string().email("Enter a valid email").or(z.literal("")).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["active", "pending", "blocked"]),
})

const EMPTY = { name: "", category: "", gstNo: "", email: "", phone: "", address: "", status: "active" }

export function VendorFormDialog({ open, onOpenChange, vendor }) {
  const save = useSaveVendor()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: EMPTY })

  useEffect(() => {
    if (!open) return
    reset(
      vendor
        ? {
            name: vendor.name || "",
            category: vendor.category || "",
            gstNo: vendor.gstNo || "",
            email: vendor.email || "",
            phone: vendor.phone || "",
            address: vendor.address || "",
            status: vendor.status || "active",
          }
        : EMPTY
    )
  }, [open, vendor, reset])

  async function onSubmit(values) {
    await save.mutateAsync({ id: vendor?.id, data: values })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{vendor ? "Edit vendor" : "Add vendor"}</DialogTitle>
          <DialogDescription>
            {vendor ? "Update this supplier's details." : "Register a new supplier."}
          </DialogDescription>
        </DialogHeader>

        {save.isError && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {save.error.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Vendor name</Label>
            <Input id="name" placeholder="Infra Supplies Pvt Ltd" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select id="category" className={selectClass} {...register("category")}>
                <option value="">Select category</option>
                {VENDOR_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select id="status" className={selectClass} {...register("status")}>
                {VENDOR_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gstNo">GST number</Label>
              <Input id="gstNo" placeholder="24AABCI1234A1Z5" {...register("gstNo")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+91 90000 00000" {...register("phone")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="sales@vendor.in" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="City, State" {...register("address")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {vendor ? "Save changes" : "Add vendor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
