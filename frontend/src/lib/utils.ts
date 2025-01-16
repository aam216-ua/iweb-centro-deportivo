import { Status } from "@/types/user"
import { type ClassValue, clsx } from "clsx"
import { ShieldAlert, UserCheck, UserCog } from "lucide-vue-next"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function randImage(): string {
  const images: string[] = ["/golf.jpg", "/tennis.jpg", "/tennis2.jpg"]
  return randChoice(images)
}

export const getStatusConfig = (status: Status) => {
  const configs = {
    [Status.pending]: {
      icon: ShieldAlert,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      label: "Pendiente",
    },
    [Status.blocked]: {
      icon: UserCog,
      color: "text-red-500",
      bg: "bg-red-500/10",
      label: "Bloqueado",
    },
    [Status.created]: {
      icon: UserCheck,
      color: "text-green-500",
      bg: "bg-green-500/10",
      label: "Activo",
    },
  }
  return configs[status]
}
