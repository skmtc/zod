import { SchematicBase } from '@skmtc/skmtc/dsl'
import type { CoreContext } from '@skmtc/skmtc/context'
import type { Stringable } from '@skmtc/skmtc/dsl'
import type { OasRef } from '@skmtc/skmtc/oas-elements'
import type { OasSchema } from '@skmtc/skmtc/oas-schema'

type ZodIntersectionArgs = {
  context: CoreContext
  destinationPath: string
  members: (OasSchema | OasRef<'schema'>)[]
}

export class ZodIntersection extends SchematicBase implements Stringable {
  members: (OasSchema | OasRef<'schema'>)[]
  allObjects: boolean

  private constructor({
    context,
    destinationPath,
    members
  }: ZodIntersectionArgs) {
    super({ context })

    this.members = members

    this.allObjects = members.every(member => {
      return member.resolve().type === 'object'
    })

    this.children = toChildren({ context, destinationPath, members })
  }

  static create(args: ZodIntersectionArgs) {
    return new ZodIntersection(args)
  }

  toString() {
    const [first, ...rest] = this.children

    const firstString = first.toString()

    if (this.allObjects) {
      return rest.reduce<string>((acc, child) => {
        return `${acc}.merge(${child})`
      }, firstString)
    } else {
      return rest.reduce<string>((acc, child) => {
        return `${acc}.and(${child})`
      }, firstString)
    }
  }
}

type ToChildrenArgs = {
  context: CoreContext
  destinationPath: string
  members: (OasSchema | OasRef<'schema'>)[]
}

const toChildren = ({
  context,
  destinationPath,
  members
}: ToChildrenArgs): Stringable[] => {
  return members.map(value =>
    context.toTypeSystem({ destinationPath, value, required: true })
  )
}
