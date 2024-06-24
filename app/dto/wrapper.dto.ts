import { QueryBaseSchema } from '#validators/query.validator'
import { CreateWrapperSchema, UpdateWrapperSchema } from '#validators/wrapper.validator'
import { Infer } from '@vinejs/vine/types'

export type CreateWrapperDTO = Infer<typeof CreateWrapperSchema>
export type UpdateWrapperDTO = Infer<typeof UpdateWrapperSchema>
export type QueryWrapperDTO = Infer<typeof QueryBaseSchema>
