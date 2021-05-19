import Home from './components/pages/Home';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import ProductPage from './components/pages/ProductPage/ProductPage';
import {getAll, getProduct, getImage, getProductImages} from './api';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import "./App.scss"

function App() {

  // getAll().then(res => console.log(res));
  
  return (
      <>
      <Router>
        <Header></Header>
        <Switch>
          <Route path="/product/:id" component={ProductPage} >
           
          </Route>
          <Route path="/">
            <Home getAllProducts={getAll}></Home>
          </Route>

        </Switch>
        
      </Router>
      </>
  );
}

export default App;
