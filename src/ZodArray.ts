import type { CoreContext } from '@skmtc/skmtc/context'
import type { Stringable } from '@skmtc/skmtc/dsl'
import type { OasRef } from '@skmtc/skmtc/oas-elements'
import type { OasSchema } from '@skmtc/skmtc/oas-schema'

type ZodArrayArgs = {
  context: CoreContext
  destinationPath: string
  items: OasSchema | OasRef<'schema'>
}

export class ZodArray implements Stringable {
  items: Stringable

  private constructor({ context, destinationPath, items }: ZodArrayArgs) {
    this.items = context.toTypeSystem({
      destinationPath,
      value: items,
      required: true
    })
  }

  static create(args: ZodArrayArgs) {
    return new ZodArray(args)
  }

  toString() {
    return `z.array(${this.items})`
  }
}
