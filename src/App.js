import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { onAuthStateChangedListener, createUserDocumentFromAuth } from './utils/firebase/firebase';
import { setCurrentUser } from './store/user/user-action';

import Home from './routes/home/home';
import Navigation from './routes/navigation/navigation';
import Authentication from './routes/authentication/authentication';
import Shop from './routes/shop/shop';
import Checkout from './routes/checkout/checkout';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => { // useeffect updates initially once only
    const unsubscribe = onAuthStateChangedListener((user) => {
        if (user) {
            createUserDocumentFromAuth(user);
        }
        dispatch(setCurrentUser(user)); // there is only ever 1 dispatch instance in redux, reference to this dispatch never changes, updates the root reducer
    });

    return unsubscribe; // unsubscribe when unmount
  }, []); // runs once when component mounts

  return (
    <Routes>
      <Route path='/' element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path='shop' element={<Shop />} />
        <Route path='auth' element={<Authentication />} />
        <Route path='checkout' element={<Checkout/>} />
      </Route>
    </Routes>
  );
};

export default App;
