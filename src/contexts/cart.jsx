import { createContext, useState, useEffect, useReducer } from "react";

import { createAction } from '../utils/reducer/reducer';

const addCartItem = (cartItems, productToAdd) => {
    // find if cartItems contains product to add
    const existingCartItem = cartItems.find((cartItem) => cartItem.id === productToAdd.id);
    
    // if found, increment quantity
    if (existingCartItem) {
        return cartItems.map((cartItem) =>
            cartItem.id === productToAdd.id ? 
            {...cartItem, quantity: cartItem.quantity + 1}
            : cartItem
        );
    }

    // return new array with modified cartItems / new cartItem
    return [...cartItems, {...productToAdd, quantity: 1}];
}

const removeCartItem = (cartItems, productToRemove) => {
    const existingCartItem = cartItems.find((cartItem) => cartItem.id === productToRemove.id);

    if (existingCartItem.quantity > 1) {
        // decrement the value
        return cartItems.map((cartItem) => 
            cartItem.id === productToRemove.id ? 
            {...cartItem, quantity: cartItem.quantity - 1}
            : cartItem
        );
    }

    return cartItems.filter((cartItem) => cartItem.id !== productToRemove.id);
}

const clearCartItem = (cartItems, productToClear) => {
    cartItems.filter((cartItem) => cartItem.id !== productToClear.id);
}

export const CartContext = createContext({
    isCartOpen: false,
    setIsCartOpen: () => {},
    cartItems: [],
    addItemToCart: () => {},
    removeItemFromCart: () => {},
    clearItemFromCart: () => {},
    cartCount: 0,
    cartTotal: 0,
});

const CART_ACTION_TYPES = {
    SET_CART_ITEMS: 'SET_CART_ITEMS',
    SET_IS_CART_OPEN: 'SET_IS_CART_OPEN'
}

const INITIAL_STATE = {
    isCartOpen: false,
    cartItems: [],
    cartCount: 0,
    cartTotal: 0,
};

const cartReducer = (state, action) => {
    const { type, payload } = action;

    switch(type) {
        case CART_ACTION_TYPES.SET_CART_ITEMS:
            return {
                ...state,
                ...payload,
            }
        case CART_ACTION_TYPES.SET_IS_CART_OPEN:
            return {
                ...state,
                isCartOpen: payload,
            }
        default:
            throw new Error(`unhandled type of ${type} in cartReducer`);
    }
}

export const CartProvider = ({ children }) => {
    // const [isCartOpen, setIsCartOpen] = useState(false);
    // const [cartItems, setCartItems] = useState([]);
    // const [cartItemCount, setCartItemCount] = useState(0);
    // const [cartTotal, setCartTotal] = useState(0);

    const [{ cartItems, isCartOpen, cartItemCount, cartTotal }, dispatch] = useReducer(cartReducer, INITIAL_STATE);

    // useEffect(() => {
    //     const count = cartItems.reduce(
    //     (total, cartItem) => total + cartItem.quantity,
    //     0
    //     );
    //     setCartItemCount(count);
    // }, [cartItems]);

    // useEffect(() => {
    //     const newCartTotal = cartItems.reduce(
    //         (total, cartItem) => total + cartItem.quantity * cartItem.price,
    //         0
    //       );
    //       setCartTotal(newCartTotal);
    // }, [cartItems]);

    const updateCartItemsReducer = (newCartItems) => {
        /* 
        
        generate newCartTotal

        generate newCartCount

        dispatch new acction with payload = {
            newCartItems,
            newCartTotal,
            newCartCount
        } 

        */

        const newCartTotal = newCartItems.reduce(
            (total, cartItem) => total + cartItem.quantity * cartItem.price,
            0
        );

        const newCartCount = newCartItems.reduce(
            (total, cartItem) => total + cartItem.quantity,
            0
        );

        dispatch(
            createAction(CART_ACTION_TYPES.SET_CART_ITEMS, {
                cartItems: newCartItems, 
                cartCount: newCartCount,
                cartTotal: newCartTotal
            })
        );
    };

    const addItemToCart = (productToAdd) => {
        const newCartItems = addCartItem(cartItems, productToAdd);
        updateCartItemsReducer(newCartItems);
    };

    const removeItemToCart = (productToRemove) => {
        const newCartItems = removeCartItem(cartItems, productToRemove);
        updateCartItemsReducer(newCartItems);
    };

    const clearItemFromCart = (productToClear) => {
        const newCartItems = clearCartItem(cartItems, productToClear);
        updateCartItemsReducer(newCartItems);
    };

    const setIsCartOpen = (bool) => {
        dispatch(createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, bool));
    }

    const value = { 
        isCartOpen, 
        setIsCartOpen, 
        addItemToCart, 
        removeItemToCart,
        clearItemFromCart,
        cartItems, 
        cartItemCount,
        cartTotal, 
    }; // everything added to value is what is exposed to the context

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}