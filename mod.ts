import type { TypeSystem } from '@skmtc/skmtc/schematic-types'
import { decapitalize } from '@skmtc/skmtc/helpers'
import { Zod } from './src/Zod.ts'
import { EntityType } from '@skmtc/skmtc/typescript'
import { ZodInferType } from './src/ZodInferType.ts'

const zodTypeSystem: TypeSystem = {
  id: '@skmtc/zod@0.0.1',
  create: args => Zod.create(args),
  inferType: args => ZodInferType.create(args),
  formatIdentifier: decapitalize,
  type: EntityType.create('value')
}

export default zodTypeSystem
