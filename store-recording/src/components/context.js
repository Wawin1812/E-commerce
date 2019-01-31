import React, { Component } from "react";

import { storeProducts, detailProduct } from "../data";
//import Details from "./Details";
//import Product from "./Product";
import CartTotal from "./Cart/CartTotal";

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    product: [],
    details: detailProduct,
    cart: [],
    modelOpen: false,
    modelProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
  };
  componentDidMount() {
    this.setProducts();
  }

  setProducts = () => {
    let tempProduct = [];
    storeProducts.forEach(item => {
      const singleItem = { ...item };
      tempProduct = [...tempProduct, singleItem];
    });
    this.setState(() => {
      return { product: tempProduct };
    });
  };
  getItem = id => {
    const product = this.state.product.find(item => item.id === id);
    return product;
  };
  handleDetail = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { details: product };
    });
  };

  addToCart = id => {
    let tempProduct = [...this.state.product];
    const index = tempProduct.indexOf(this.getItem(id));
    const product = tempProduct[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    this.setState(
      () => {
        return { product: tempProduct, cart: [...this.state.cart, product] };
      },
      () => {
        this.addTotal();
      }
    );
  };
  openModel = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { modelProduct: product, modelOpen: true };
    });
  };
  closeModel = () => {
    this.setState(() => {
      return { modelOpen: false };
    });
  };

  increment = id => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count + 1;
    product.total = product.count * product.price;
    this.setState(
      () => {
        return {
          cart: [...tempCart]
        };
      },
      () => {
        this.addTotal();
      }
    );
  };

  decrement = id => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count - 1;
    if (product.count === 0) {
      this.removeItem(id);
    } else {
      product.total = product.count * product.price;
      this.setState(
        () => {
          return {
            cart: [...tempCart]
          };
        },
        () => {
          this.addTotal();
        }
      );
    }
  };

  removeItem = id => {
    let tempProduct = [...this.state.product];
    let tempCart = [...this.state.cart];
    tempCart = tempCart.filter(item => item.id !== id);
    const index = tempProduct.indexOf(this.getItem(id));
    let removedProduct = tempProduct[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;
    this.setState(
      () => {
        return {
          cart: [...tempCart],
          product: [...tempProduct]
        };
      },
      () => {
        this.addTotal();
      }
    );
  };

  clearCart = () => {
    this.setState(
      () => {
        return { cart: [] };
      },
      () => {
        this.setProducts();
        this.addTotal();
      }
    );
  };

  addTotal = () => {
    let subTotal = 0;
    this.state.cart.map(item => (subTotal += item.total));
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax ;
    this.setState(() => {
      return {
        cartSubTotal: subTotal,
        cartTax: tax,
        cartTotal: total
      };
    });
  };
  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModel: this.openModel,
          closeModel: this.closeModel,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;
export { ProductProvider, ProductConsumer };
