import { LucidModel, ModelAttributes } from '@adonisjs/lucid/types/model'

type Model<T extends LucidModel> = ModelAttributes<InstanceType<T>>

export type Create<T extends LucidModel> = Partial<Model<T>>
export type Update<T extends LucidModel> = Partial<Model<T>>
export type Where<T extends LucidModel> = Partial<
  Model<T> & {
    page: number
    per_page: number
    search?: string
  }
>

export type Find<T extends LucidModel> = Partial<
  Omit<Model<T>, 'created_at' | 'updated_at'> & {
    clause?: 'AND' | 'OR'
  }
>
