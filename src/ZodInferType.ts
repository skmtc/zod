import { SchematicBase } from '@skmtc/skmtc/dsl'
import type { Stringable } from '@skmtc/skmtc/dsl'
import type { CoreContext } from '@skmtc/skmtc/context'

type ZodInferTypeArgs = {
  context: CoreContext
  value: Stringable
}

export class ZodInferType extends SchematicBase {
  value: Stringable

  private constructor({ context, value }: ZodInferTypeArgs) {
    super({ context })

    this.value = value
  }

  static create({ context, value }: ZodInferTypeArgs): ZodInferType {
    return new ZodInferType({ context, value })
  }

  toString(): string {
    return `z.infer<typeof ${this.value}>`
  }
}
