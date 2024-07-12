import vine from '@vinejs/vine'

export const QueryBaseSchema = vine.object({
  per_page: vine.number().positive().optional(),
  page: vine.number().positive().optional(),
  search: vine.string().trim().optional(),
  store_id: vine.number().positive().optional(),
  user_id: vine.number().positive().optional(),
})
