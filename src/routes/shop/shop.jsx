// import SHOP_DATA from '../../utils/shop-data.json'; // automatically imports entire json file as an array
import { useContext } from 'react';

import { ProductsContext } from '../../contexts/products';
import ProductCard from '../../components/product-card/product-card';

import './shop.scss';

const Shop = () => {
    const { products } = useContext(ProductsContext);

    return (
        <div className='products-container'>
            {products.map((product) => (
                <ProductCard key={product.id} product={product}/> // key is not an argument in ProductCard, but is needed when mapping
            ))}
        </div>
    )
}

export default Shop;