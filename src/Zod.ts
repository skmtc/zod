import { ZodString } from './ZodString.ts'
import { ZodArray } from './ZodArray.ts'
import { match } from 'ts-pattern'
import type { Stringable } from '@skmtc/skmtc/dsl'
import { ZodRef } from './ZodRef.ts'
import { ZodObject } from './ZodObject.ts'
import { ZodUnion } from './ZodUnion.ts'
import { ZodIntersection } from './ZodIntersection.ts'
import { SchematicBase } from '@skmtc/skmtc/dsl'
import type { TypeSystemArgs } from '@skmtc/skmtc/schematic-types'
import type { CoreContext } from '@skmtc/skmtc/context'
import type { OasRef } from '@skmtc/skmtc/oas-elements'
import type { OasVoid, OasSchema } from '@skmtc/skmtc/oas-schema'
import { withDescription } from '@skmtc/skmtc/typescript'
import { ZodOptional } from './ZodOptional.ts'

export class Zod extends SchematicBase implements Stringable {
  destinationPath: string
  value: OasSchema | OasRef<'schema'> | OasVoid
  required: boolean | undefined

  private constructor({
    context,
    destinationPath,
    value,
    required
  }: TypeSystemArgs) {
    super({ context })

    this.destinationPath = destinationPath
    this.value = value
    this.required = required

    const children = toChildren({ value, required, destinationPath, context })

    this.children.push(children)

    this.register({
      imports: {
        zod: {
          importNames: 'z',
          external: true
        }
      },
      destinationPath: this.destinationPath
    })
  }

  static create(args: TypeSystemArgs): Stringable {
    return new Zod(args)
  }

  toString() {
    return this.renderChildren()
  }
}

type ToChildrenArgs = {
  context: CoreContext
  destinationPath: string
  value: OasSchema | OasRef<'schema'> | OasVoid
  required: boolean | undefined
}

const toChildren = ({
  context,
  destinationPath,
  value,
  required
}: ToChildrenArgs): Stringable => {
  const children = match(value)
    .with({ schematicType: 'ref' }, ref => {
      return ZodRef.create({ context, destinationPath, ref })
    })
    .with({ type: 'array' }, ({ items }) => {
      return ZodArray.create({
        context,
        destinationPath,
        items
      })
    })
    .with({ type: 'object' }, matched => {
      return ZodObject.create({ context, destinationPath, value: matched })
    })
    .with({ type: 'union' }, ({ members, discriminator }) => {
      return ZodUnion.create({
        context,
        destinationPath,
        members,
        discriminator
      })
    })
    .with({ type: 'intersection' }, ({ members }) => {
      return ZodIntersection.create({ context, destinationPath, members })
    })
    .with({ type: 'number' }, () => `z.number()`)
    .with({ type: 'integer' }, () => `z.number().int()`)
    .with({ type: 'boolean' }, () => `z.boolean()`)
    .with({ type: 'void' }, () => `z.void()`)
    .with({ type: 'string' }, mathed => {
      return ZodString.create({ value: mathed })
    })
    .with({ type: 'unknown' }, () => `z.unknown()`)
    .exhaustive()

  return withDescription(
    ZodOptional.create({ required, value: children }),
    value?.description
  )
}
