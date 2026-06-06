import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Plus, Trash2, Loader2, AlertCircle } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { VENDOR_CATEGORIES } from "@/features/vendors/constants"
import { useVendors } from "@/features/vendors/hooks"
import { RFQ_UNITS } from "@/features/rfq/constants"
import { useCreateRfq } from "@/features/rfq/hooks"

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().optional(),
  deadline: z.string().optional(),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Required"),
        quantity: z.coerce.number().min(1, "Min 1"),
        unit: z.string(),
      })
    )
    .min(1, "Add at least one item"),
})

export function CreateRfqPage() {
  const navigate = useNavigate()
  const create = useCreateRfq()
  const { data: vendors, isLoading: vendorsLoading } = useVendors({})
  const [selected, setSelected] = useState([])
  const [formError, setFormError] = useState("")

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: "", category: "", deadline: "", description: "", items: [{ name: "", quantity: 1, unit: "NOS" }] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: "items" })

  function toggleVendor(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function submit(values, status) {
    setFormError("")
    try {
      await create.mutateAsync({ ...values, status, vendorIds: selected })
      navigate("/rfqs")
    } catch (err) {
      setFormError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/rfqs" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to RFQs
        </Link>
        <PageHeader title="Create RFQ" description="Request quotations from your vendors." />
      </div>

      {formError && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {formError}
        </div>
      )}

      <form className="space-y-5">
        <Card className="space-y-4 p-6">
          <h2 className="font-serif text-lg font-semibold text-foreground">Details</h2>
          <div className="space-y-2">
            <Label htmlFor="title">RFQ title</Label>
            <Input id="title" placeholder="Office Furniture Procurement Q2" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
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
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" {...register("deadline")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Briefly describe what you need..." {...register("description")} />
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-foreground">Line Items</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", quantity: 1, unit: "NOS" })}>
              <Plus className="h-4 w-4" /> Add item
            </Button>
          </div>
          <div className="space-y-3">
            {fields.map((field, i) => (
              <div key={field.id} className="flex flex-wrap items-start gap-2">
                <div className="min-w-[180px] flex-1">
                  <Input placeholder="Item or service" {...register(`items.${i}.name`)} />
                  {errors.items?.[i]?.name && <p className="mt-1 text-xs text-destructive">{errors.items[i].name.message}</p>}
                </div>
                <Input type="number" min={1} className="w-24" {...register(`items.${i}.quantity`)} />
                <select className={cn(selectClass, "w-28")} {...register(`items.${i}.unit`)}>
                  {RFQ_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} disabled={fields.length === 1} aria-label="Remove item">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          {errors.items?.message && <p className="text-xs text-destructive">{errors.items.message}</p>}
        </Card>

        <Card className="space-y-4 p-6">
          <h2 className="font-serif text-lg font-semibold text-foreground">Assign Vendors</h2>
          {vendorsLoading ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {vendors.map((v) => (
                <label
                  key={v.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/40"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(v.id)}
                    onChange={() => toggleVendor(v.id)}
                    className="h-4 w-4 accent-[hsl(var(--primary))]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{v.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {v.category || "—"}
                      {v.gstNo ? ` · ${v.gstNo}` : ""}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">{selected.length} vendor(s) selected</p>
        </Card>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={handleSubmit((v) => submit(v, "draft"))} disabled={create.isPending}>
            Save as Draft
          </Button>
          <Button type="button" onClick={handleSubmit((v) => submit(v, "open"))} disabled={create.isPending}>
            {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Send to Vendors
          </Button>
        </div>
      </form>
    </div>
  )
}
