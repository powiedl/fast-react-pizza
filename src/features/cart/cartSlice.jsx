import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cart: [],
  //   cart: [
  //     {
  //       pizzaId: 12,
  //       name: 'Mediterranen',
  //       quantity: 2,
  //       unitPrice: 16,
  //       totalPrice: 32,
  //     },
  //   ],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      // payload ist ein neues Element (Pizza + Qty)
      state.cart.push(action.payload)
    },
    deleteItem(state, action) {
      // payload ist die Id der zu löschenden Pizza
      //state.cart = state.cart.filter((item) => item.pizzaId !== action.payload)
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload)
    },
    increaseItemQuantity(state, action) {
      // payload ist die pizzaId der zu ändernden Pizza
      const item = state.cart.find((item) => item.pizzaId === action.payload)
      if (item) {
        item.quantity++
        item.totalPrice = item.unitPrice * item.quantity
      }
    },
    decreaseItemQuantity(state, action) {
      // payload ist die pizzaId der zu ändernden Pizza
      const item = state.cart.find((item) => item.pizzaId === action.payload)
      if (item) {
        item.quantity--
        item.totalPrice = item.unitPrice * item.quantity
      }
      if (item.quantity === 0) {
        cartSlice.caseReducers.deleteItem(state, action)
      }
    },
    clearCart(state) {
      state.cart = []
    },
  },
})

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer

export const getCart = (state) => state.cart.cart

export const getTotalCartQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0)

export const getTotalCartPrice = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0)

// diese Selectorfunktion ist ziemlich kompliziert ...
export const getCurrentQuantityById =
  (
    id // exportiert eine Arrow-Funktion, die id als Parameter hat
  ) =>
  (
    state // die selbst eine Funktion zurückliefert, die state als Parameter hat
  ) =>
    // (das ist der "technische" Selector, da dieser immer eine Funktion ist, die state als Parameter hat)
    // in dem Selector hat man jetzt Zugriff auf den state und die id der betrefffenden Pizza
    state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0 // es wird die betreffende Pizza im Cart gesucht, dann mit optional Chaining die quantity ermittelt (d. h. wenn die Pizza gefunden wurde, gibt es das Attribut quantity und dieses wird zurückgeliefert) - wenn es nicht existiert ist das Ergebnis von dem optional Chaining null - und in diesem Fall wird 0 zurückgeliefert (mit Hilfe von ?? )

/*
export const getCurrentQuantityById = (id) => ...  // exportiert eine Arrow-Funktion, die id als Parameter hat

*/

// 'reselect' library - für große Redux Anwendungen, weil da diese Art der Selector-Funktionen zu Performanceproblemen führen kann
