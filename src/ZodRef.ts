import { Identifier } from '@skmtc/skmtc/dsl'
import type { CoreContext } from '@skmtc/skmtc/context'
import type { Stringable } from '@skmtc/skmtc/dsl'
import { SchematicBase } from '@skmtc/skmtc/dsl'
import type { OasRef } from '@skmtc/skmtc/oas-elements'

type ZodRefProps = {
  context: CoreContext
  destinationPath: string
  ref: OasRef<'schema'>
}

type ZodRefConstructorProps = {
  context: CoreContext
  destinationPath: string
  ref: OasRef<'schema'>
  identifier: Identifier
}

export class ZodRef extends SchematicBase implements Stringable {
  destinationPath: string
  ref: OasRef<'schema'>
  identifier: Identifier

  private constructor({
    context,
    destinationPath,
    ref,
    identifier
  }: ZodRefConstructorProps) {
    super({ context })

    this.destinationPath = destinationPath
    this.ref = ref
    this.identifier = identifier
  }

  static create({ context, destinationPath, ref }: ZodRefProps) {
    const identifier = Identifier.from$Ref({
      $ref: ref.$ref,
      context
    })

    return new ZodRef({
      context,
      destinationPath,
      ref,
      identifier
    })
  }

  toString() {
    return this.identifier.name
  }
}
