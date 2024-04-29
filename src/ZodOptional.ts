import type { Stringable } from '@skmtc/skmtc/dsl'

type ZodOptionalArgs = {
  required: boolean | undefined
  value: Stringable
}

export class ZodOptional implements Stringable {
  required: boolean | undefined
  value: Stringable

  private constructor({ required, value }: ZodOptionalArgs) {
    this.required = required
    this.value = value
  }

  static create(args: ZodOptionalArgs) {
    return new ZodOptional(args)
  }

  toString() {
    return this.required ? `${this.value}` : `${this.value}.optional()`
  }
}
