import { QueryBaseSchema } from '#validators/query.validator'
import vine from '@vinejs/vine'

export const CreateProductSchema = vine.object({
  name: vine.string(),
  description: vine.string(),
  price: vine.number(),
  quantity: vine.number(),
  photo: vine.file().optional(),
  currencies: vine.array(vine.enum(['USD', 'BRL', 'EUR', 'GBP'])),
  store_id: vine.number().positive().optional(),
  user_id: vine.number().positive().optional(),
})

export const UpdateProductSchema = vine.object({
  id: vine.number().positive().optional(),
  name: vine.string().optional(),
  description: vine.string().optional(),
  price: vine.number().optional(),
  quantity: vine.number().optional(),
  photo: vine.file().optional(),
  currencies: vine.array(vine.enum(['USD', 'BRL', 'EUR', 'GBP'])).optional(),
  store_id: vine.number().positive().optional(),
  user_id: vine.number().positive().optional(),
})

export const CreateProductValidator = vine.compile(CreateProductSchema)
export const UpdateProductValidator = vine.compile(UpdateProductSchema)
export const QueryProductValidator = vine.compile(QueryBaseSchema)
