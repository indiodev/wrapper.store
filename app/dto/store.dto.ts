import { QueryBaseSchema } from '#validators/query.validator'
import { CreateStoreSchema, UpdateStoreSchema } from '#validators/store.validator'
import { Infer } from '@vinejs/vine/types'

export type CreateStoreDTO = Infer<typeof CreateStoreSchema>
export type UpdateStoreDTO = Infer<typeof UpdateStoreSchema>
export type QueryStoreDTO = Infer<typeof QueryBaseSchema>
