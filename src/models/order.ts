import { number, string } from 'prop-types'

export type OrderType = {
  id: string
  email: string
  name: string
  total: number
  order_items: OrderItemType[]
}

export type OrderItemType = {
  id: string
  product_title: string
  price: number
  quantity: number
}
