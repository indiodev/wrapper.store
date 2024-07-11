import { CreateProductSchema, UpdateProductSchema } from '#validators/product.validator'
import { QueryBaseSchema } from '#validators/query.validator'
import { Infer } from '@vinejs/vine/types'

export type CreateProductDTO = Infer<typeof CreateProductSchema>
export type UpdateProductDTO = Infer<typeof UpdateProductSchema>
export type QueryProductDTO = Infer<typeof QueryBaseSchema>
