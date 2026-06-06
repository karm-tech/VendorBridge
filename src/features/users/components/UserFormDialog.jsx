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
import { ROLE_OPTIONS, ROLES } from "@/constants/roles"
import { useSaveUser } from "@/features/users/hooks"

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters").or(z.literal("")),
  role: z.enum([ROLES.ADMIN, ROLES.OFFICER, ROLES.MANAGER, ROLES.VENDOR]),
})

const EMPTY = { firstName: "", lastName: "", email: "", password: "", role: ROLES.OFFICER }

export function UserFormDialog({ open, onOpenChange, user }) {
  const save = useSaveUser()
  const isEdit = Boolean(user)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: EMPTY })

  useEffect(() => {
    if (!open) return
    reset(
      user
        ? { firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "", password: "", role: user.role }
        : EMPTY
    )
  }, [open, user, reset])

  async function onSubmit(values) {
    if (!isEdit && !values.password) {
      setError("password", { message: "Password is required for a new user" })
      return
    }
    const data = isEdit
      ? { firstName: values.firstName, lastName: values.lastName, role: values.role }
      : { firstName: values.firstName, lastName: values.lastName, email: values.email, password: values.password, role: values.role }
    if (values.password) data.password = values.password
    await save.mutateAsync({ id: user?.id, data })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit user" : "Add user"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update this user's name or role." : "Create an account and assign a role."}
          </DialogDescription>
        </DialogHeader>

        {save.isError && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {save.error.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" placeholder="Aanya" {...register("firstName")} />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" placeholder="Sharma" {...register("lastName")} />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="user@vendorbridge.app" disabled={isEdit} {...register("email")} />
            {isEdit && <p className="text-xs text-muted-foreground">Email cannot be changed.</p>}
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select id="role" className={selectClass} {...register("role")}>
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{isEdit ? "New password" : "Password"}</Label>
              <Input id="password" type="password" placeholder={isEdit ? "Leave blank to keep" : "Min 6 characters"} {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Add user"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
