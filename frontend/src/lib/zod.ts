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
        message = "Campo requerido"
      } else {
        const expectedType = typeMapping[issue.expected] || issue.expected
        const receivedType = typeMapping[issue.received] || issue.received
        message = `Se esperaba ${expectedType}, pero se recibió ${receivedType}`
      }
      break

    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "email") {
        message = "Email inválido"
      } else if (issue.validation === "url") {
        message = "URL inválida"
      } else if (issue.validation === "uuid") {
        message = "UUID inválido"
      } else if (issue.validation === "cuid") {
        message = "CUID inválido"
      } else if (issue.validation === "regex") {
        message = "Formato inválido"
      } else if (issue.validation === "datetime") {
        message = "Fecha/hora inválida"
      } else {
        message = "Texto inválido"
      }
      break

    case z.ZodIssueCode.not_finite:
      message = "Número inválido"
      break

    case z.ZodIssueCode.invalid_date:
      message = "Fecha inválida"
      break

    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        if (issue.minimum === 1) {
          message = "Campo requerido"
        } else {
          message = issue.inclusive
            ? `Mínimo ${issue.minimum} caracteres`
            : `Más de ${issue.minimum} caracteres`
        }
      } else if (issue.type === "number") {
        message = issue.inclusive ? `Mínimo ${issue.minimum}` : `Mayor que ${issue.minimum}`
      } else if (issue.type === "array") {
        message = issue.inclusive
          ? `Mínimo ${issue.minimum} elementos`
          : `Más de ${issue.minimum} elementos`
      } else {
        message = "Valor muy pequeño"
      }
      break

    case z.ZodIssueCode.too_big:
      if (issue.type === "string") {
        message = issue.inclusive
          ? `Máximo ${issue.maximum} caracteres`
          : `Menos de ${issue.maximum} caracteres`
      } else if (issue.type === "number") {
        message = issue.inclusive ? `Máximo ${issue.maximum}` : `Menor que ${issue.maximum}`
      } else if (issue.type === "array") {
        message = issue.inclusive
          ? `Máximo ${issue.maximum} elementos`
          : `Menos de ${issue.maximum} elementos`
      } else {
        message = "Valor muy grande"
      }
      break

    case z.ZodIssueCode.custom:
      message = issue.message || "Valor inválido"
      break
    case z.ZodIssueCode.invalid_arguments:
      message = "Argumentos inválidos"
      break
    case z.ZodIssueCode.invalid_return_type:
      message = "Tipo de retorno inválido"
      break
    case z.ZodIssueCode.invalid_enum_value:
      message = `Valores válidos: ${issue.options.join(", ")}`
      break
    case z.ZodIssueCode.unrecognized_keys:
      message = `Campos no permitidos: ${issue.keys.join(", ")}`
      break
    case z.ZodIssueCode.invalid_union_discriminator:
      message = `Valores válidos: ${issue.options.join(", ")}`
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
