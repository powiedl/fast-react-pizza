//import React from 'react'
import { useFetcher } from 'react-router-dom'
import Button from '../../ui/Button'
import { updateOrder } from '../../services/apiRestaurant'
export default function UpdateOrder({ order }) {
  const fetcher = useFetcher()

  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make Priority</Button>
    </fetcher.Form>
  )
}
export async function action({ request, params }) {
  const data = { priority: true } // die geänderten Daten - weil die API eine PATCH-Methode ist (und daher nur die geänderten Daten erwartet)
  await updateOrder(params.orderId, data) // weil in der URL die ID steht und in der route der param :orderId genannt wurde
  return null
}
