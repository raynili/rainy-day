import { useContext } from 'react';

import Button from '../button/button';
import { CartContext } from '../../contexts/cart';

import './product-card.scss';

const ProductCard = ({ product }) => {
    const { name, price, imageUrl } = product;
    const { addItemToCart } = useContext(CartContext);

    const addProductToCart = () => addItemToCart(product);

    return (
        <div className="product-card-container">
            <img alt={`${name}`} src={imageUrl}/>
            
            <div className="footer">
                <span className="name">{name}</span>
                <span className='price'>{price}</span>
            </div>
            <Button buttonType="inverted" onClick={addProductToCart}>
                Add to Cart
            </Button>
        </div>
    );

}

export default ProductCard;