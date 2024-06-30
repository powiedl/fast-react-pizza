import { useState } from 'react'
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { clearCart, getCart } from '../cart/cartSlice'
import { createOrder } from '../../services/apiRestaurant'
import Button from '../../ui/Button'
import EmptyCart from '../Cart/EmptyCart'
import store from '../../store' // nötig, damit wir die dispatch-Funktion außerhalb von Komponenten verwenden können
// sollte aber nur in Ausnahmefällen gemacht werden - das Leeren des carts nach der Bestellung ist so eine Ausnahme

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  )

function CreateOrder() {
  const navigation = useNavigation()
  const username = useSelector((state) => state.user.username)
  const isSubmitting = navigation.state === 'submitting'

  const formErrors = useActionData()
  const cart = useSelector(getCart)
  if (!cart.length) return <EmptyCart />

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">
        Ready to order? Let&apos;s go!
      </h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            type="text"
            name="customer"
            required
            defaultValue={username}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="flex flex-col">
            <div className="grow">
              <input type="tel" name="phone" required className="input w-72" />
            </div>
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              required
            />
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want you to give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button disabled={isSubmitting} type="primary">
            {isSubmitting ? 'Placing order....' : 'Order now'}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export async function action({ request }) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'on',
  }
  const errors = {}
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.'

  if (Object.keys(errors).length > 0) return errors

  // If everything is okay, create new order and redirect

  const newOrder = await createOrder(order)
  store.dispatch(clearCart())
  return redirect(`/order/${newOrder.id}`)

  //return null
}

export default CreateOrder
