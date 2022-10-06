import { createContext, useState, useEffect } from "react";

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
    cartCount: 0,
});

export const CartProvider = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        const count = cartItems.reduce(
        (total, cartItem) => total + cartItem.quantity,
        0
        );
        setCartItemCount(count);
    }, [cartItems]);

    useEffect(() => {
        const newCartTotal = cartItems.reduce(
            (total, cartItem) => total + cartItem.quantity * cartItem.price,
            0
          );
          setCartTotal(newCartTotal);
    }, [cartItems]);

    const addItemToCart = (productToAdd) => {
        setCartItems(addCartItem(cartItems, productToAdd));
    };

    const removeItemToCart = (productToRemove) => {
        setCartItems(removeCartItem(cartItems, productToRemove));
    };

    const clearItemFromCart = (productToClear) => {
        setCartItems(clearCartItem(cartItems, productToClear));
    };

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