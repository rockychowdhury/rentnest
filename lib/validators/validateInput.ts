import { z } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function validateInput<T>(
  schema: z.ZodType<T>,
  data: unknown
): Promise<ValidationResult<T>> {
  const parsed = await schema.safeParseAsync(data);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Validation failed";
    return {
      success: false,
      message: firstError,
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}

export function withValidation<TSchema extends z.ZodTypeAny, TResult>(
  schema: TSchema,
  handler: (validatedData: z.infer<TSchema>) => Promise<TResult>
) {
  return async (
    rawData: unknown
  ): Promise<TResult | { success: false; message: string }> => {
    const validation = await validateInput(schema, rawData);
    if (!validation.success) {
      return {
        success: false,
        message: validation.message,
      };
    }
    return handler(validation.data);
  };
}

export default validateInput;
