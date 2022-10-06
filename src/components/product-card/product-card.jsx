import './product-card.scss';
import Button from '../button/button';

const ProductCard = ({ product }) => {
    const { name, price, imageUrl } = product;

    return (
        <div className="product-card-container">
            <img alt={`${name}`} src={imageUrl}/>
            
            <div className="footer">
                <span className="name">{name}</span>
                <span className='price'>{price}</span>
            </div>
            <Button buttonType="inverted">Add to Cart</Button>
        </div>
    );

}

export default ProductCard;