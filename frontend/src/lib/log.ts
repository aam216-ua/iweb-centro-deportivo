export default function log(message: string, level: "info" | "warn" | "error" = "info") {
  if (level === "error") {
    console.error(message)
  } else if (level === "warn") {
    console.warn(message)
  } else {
    console.log(message)
  }
}
