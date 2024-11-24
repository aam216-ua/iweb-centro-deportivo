import { z } from "zod"

const spanishErrorMap: z.ZodErrorMap = (issue, ctx) => {
  let message: string

  const typeMapping: Record<string, string> = {
    string: "texto",
    number: "número",
    date: "fecha",
    boolean: "booleano",
    array: "lista",
    object: "objeto",
    bigint: "número grande",
    symbol: "símbolo",
    function: "función",
    undefined: "indefinido",
    null: "nulo",
    void: "vacío",
    never: "nunca",
    any: "cualquier",
    unknown: "desconocido",
    map: "mapa",
    set: "conjunto",
  }

  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === "undefined" || issue.received === "null") {
        message = "El campo es requerido"
      } else {
        const expectedType = typeMapping[issue.expected] || issue.expected
        const receivedType = typeMapping[issue.received] || issue.received
        message = `Se esperaba ${expectedType}, pero se recibió ${receivedType}`
      }
      break

    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "email") {
        message = "El correo electrónico no es válido"
      } else if (issue.validation === "url") {
        message = "La URL no es válida"
      } else if (issue.validation === "uuid") {
        message = "El UUID no es válido"
      } else if (issue.validation === "cuid") {
        message = "El CUID no es válido"
      } else if (issue.validation === "regex") {
        message = "El formato no es válido"
      } else if (issue.validation === "datetime") {
        message = "La fecha/hora no es válida"
      } else {
        message = "El texto no es válido"
      }
      break

    case z.ZodIssueCode.not_finite:
      message = "El número no es válido"
      break

    case z.ZodIssueCode.invalid_date:
      message = "La fecha no es válida"
      break

    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        if (issue.minimum === 1) {
          message = "El campo es requerido"
        } else {
          message = issue.inclusive
            ? `Debe tener al menos ${issue.minimum} caracteres`
            : `Debe tener más de ${issue.minimum} caracteres`
        }
      } else if (issue.type === "number") {
        message = issue.inclusive
          ? `Debe ser mayor o igual a ${issue.minimum}`
          : `Debe ser mayor que ${issue.minimum}`
      } else if (issue.type === "array") {
        message = issue.inclusive
          ? `Debe tener al menos ${issue.minimum} elementos`
          : `Debe tener más de ${issue.minimum} elementos`
      } else {
        message = "El valor es muy pequeño"
      }
      break

    case z.ZodIssueCode.too_big:
      if (issue.type === "string") {
        message = issue.inclusive
          ? `Debe tener máximo ${issue.maximum} caracteres`
          : `Debe tener menos de ${issue.maximum} caracteres`
      } else if (issue.type === "number") {
        message = issue.inclusive
          ? `Debe ser menor o igual a ${issue.maximum}`
          : `Debe ser menor que ${issue.maximum}`
      } else if (issue.type === "array") {
        message = issue.inclusive
          ? `Debe tener máximo ${issue.maximum} elementos`
          : `Debe tener menos de ${issue.maximum} elementos`
      } else {
        message = "El valor es muy grande"
      }
      break

    case z.ZodIssueCode.custom:
      message = issue.message || "El valor no es válido"
      break
    case z.ZodIssueCode.invalid_arguments:
      message = "Argumentos inválidos"
      break
    case z.ZodIssueCode.invalid_return_type:
      message = "Tipo de retorno inválido"
      break
    case z.ZodIssueCode.invalid_enum_value:
      message = `Valor inválido, opciones válidas: ${issue.options.join(", ")}`
      break
    case z.ZodIssueCode.unrecognized_keys:
      message = `Campos no permitidos: ${issue.keys.join(", ")}`
      break
    case z.ZodIssueCode.invalid_union_discriminator:
      message = `Valor inválido, opciones válidas: ${issue.options.join(", ")}`
      break
    case z.ZodIssueCode.invalid_literal:
      message = "Valor literal inválido"
      break
    default:
      message = ctx.defaultError
  }

  return { message }
}

z.setErrorMap(spanishErrorMap)
export { z }
