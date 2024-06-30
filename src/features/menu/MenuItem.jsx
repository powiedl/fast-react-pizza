import { formatCurrency } from '../../utils/helpers'
import Button from '../../ui/Button'
import DeleteItem from '../cart/DeleteItem'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, getCurrentQuantityById } from '../cart/cartSlice'
import UpdateItemQuantity from '../cart/UpdateItemQuantity'

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza
  const currentQuantity = useSelector(getCurrentQuantityById(id))

  const dispatch = useDispatch()
  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
    }
    dispatch(addItem(newItem))
  }
  return (
    <li className="flex gap-4 py-2">
      <img
        src={imageUrl}
        alt={name}
        className={`h-24 ${soldOut ? 'opacity-60 grayscale' : ''}`}
      />
      <div className="flex grow flex-col pt-0.5">
        <p className="text-md">{name}</p>
        <p className="text-sm capitalize italic text-stone-500">
          {ingredients.join(', ')}
        </p>
        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="text-sm font-medium uppercase text-stone-500">
              Sold out
            </p>
          )}

          {!soldOut &&
            (currentQuantity === 0 ? (
              <Button type="small" onClick={handleAddToCart}>
                Add to cart
              </Button>
            ) : (
              <div className="flex items-center justify-between gap-2 sm:gap-6">
                <UpdateItemQuantity pizzaId={id} quantity={currentQuantity} />

                <DeleteItem pizzaId={id} />
              </div>
            ))}
        </div>
      </div>
    </li>
  )
}

export default MenuItem
