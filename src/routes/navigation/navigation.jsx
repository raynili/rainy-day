import { Fragment, useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';

import CartIcon from '../../components/cart-icon/cart-icon';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown';

import { UserContext  } from '../../contexts/user';
import { CartContext } from '../../contexts/cart';

import { ReactComponent as CrwnLogo } from '../../assets/crown.svg';
import { signOutUser } from '../../utils/firebase/firebase';

import './navigation.scss';

const Navigation = () => {
    const { currentUser /*, setCurrentUser */} = useContext(UserContext); // useContext as a hook says, whenever the value inside the UserContext updates, re-render me
    // Context is updated with useState's setter function
    // any component listening for currentUser update too (re-render), jsx / UI updates

    // const signOutHandler = async () => {
    //     await signOutUser;

    //     // setCurrentUser(null);
    //     // auth listener will catch it instead
    // }

    const { isCartOpen } = useContext(CartContext);

    return (
        <Fragment>
            <div className='navigation'>
                <Link className='logo-container' to='/'>
                    <CrwnLogo className='logo' />
                </Link>
                <div className='nav-links-container'>
                    <Link className='nav-link' to='/shop'>
                        SHOP
                    </Link>
                    {
                        currentUser ? (
                            <span className='nav-link' onClick={signOutUser}>SIGN OUT</span>
                        ) : (
                            <Link className='nav-link' to='/auth'>
                                SIGN IN
                            </Link>
                        )
                    }
                    <CartIcon/>
                </div>
                {isCartOpen && <CartDropdown/>}
            </div> 
            <Outlet />
        </Fragment>
    );
};

export default Navigation;