import { useContext } from 'react';

import CheckoutItem from '../../components/checkout-item/checkout-item';

import { CartContext } from '../../contexts/cart';

import './checkout.scss';

const Checkout = () => {
    const { cartItems, cartTotal } = useContext(CartContext);

    return (
        <div className='checkout-container'>
            <div className='checkout-header'>
                <div className="headerBlock">
                    <span>Product</span>
                </div>
                <div className="headerBlock">
                    <span>Description</span>
                </div>
                <div className="headerBlock">
                    <span>Quantity</span>
                </div>
                <div className="headerBlock">
                    <span>Price</span>
                </div>
                <div className="headerBlock">
                    <span>Remove</span>
                </div>
            </div>
            {cartItems.map((cartItem) => (
                <CheckoutItem id={cartItem.id} cartItem={cartItem}/>
            ))}
            <div className="total">TOTAL: ${cartTotal}</div>
        </div>
    );

};

export default Checkout;