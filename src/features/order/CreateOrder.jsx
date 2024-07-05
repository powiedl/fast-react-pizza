import { useState } from 'react'
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice'
import { fetchAddress } from '../user/userSlice'
import { createOrder } from '../../services/apiRestaurant'
import Button from '../../ui/Button'
import EmptyCart from '../Cart/EmptyCart'
import store from '../../store' // nötig, damit wir die dispatch-Funktion außerhalb von Komponenten verwenden können
import { formatCurrency } from '../../utils/helpers'
// sollte aber nur in Ausnahmefällen gemacht werden - das Leeren des carts nach der Bestellung ist so eine Ausnahme

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  )

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false)
  const navigation = useNavigation()
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: userError,
  } = useSelector((state) => state.user)
  const isSubmitting = navigation.state === 'submitting'
  const isLoadingAddress = addressStatus === 'loading'
  const dispatch = useDispatch()

  const formErrors = useActionData()
  const cart = useSelector(getCart)
  const totalCartPrice = useSelector(getTotalCartPrice)
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0
  const totalPrice = totalCartPrice + priorityPrice
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

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="ap-1 flex w-full flex-col">
            <div className="grow">
              <input
                className="input w-full"
                type="text"
                name="address"
                disabled={isLoadingAddress}
                defaultValue={address}
                required
              />
            </div>
            {addressStatus === 'error' && (
              <p className="top-[3px] mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {userError}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[3px] z-50 md:right-[5px] md:top-[5px]">
              <Button
                type="small"
                disabled={isLoadingAddress}
                onClick={(e) => {
                  e.preventDefault()
                  dispatch(fetchAddress())
                }}
              >
                get Address
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want you to give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude},${position.longitude}`
                : ''
            }
          />
          <Button disabled={isSubmitting} type="primary">
            {isSubmitting || isLoadingAddress
              ? 'Placing order....'
              : `Order now for ${formatCurrency(totalPrice)}`}
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
    priority: data.priority === 'true', // weil die Checkbox ein controlled Input ist, ist der Wert jetzt 'true' - nicht mehr 'on'
  }
  const errors = {}
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.'

  if (Object.keys(errors).length > 0) return errors

  // If everything is okay, create new order and redirect
  //console.log(order)
  const newOrder = await createOrder(order)
  store.dispatch(clearCart())
  return redirect(`/order/${newOrder.id}`)
  //  return null
}

export default CreateOrder
