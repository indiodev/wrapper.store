import { QueryBaseSchema } from '#validators/query.validator'
import { UpdateUserSchema } from '#validators/user.validator'
import { Infer } from '@vinejs/vine/types'

export type UpdateUserDTO = Infer<typeof UpdateUserSchema>
export type QueryUserDTO = Infer<typeof QueryBaseSchema>
