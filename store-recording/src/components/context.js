import React, { Component } from "react";

import { storeProducts, detailProduct } from "../data";
import Details from "./Details";
import Product from "./Product";

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    product: [],
    details: detailProduct,
    cart: [],
    modelOpen: false,
    modelProduct: detailProduct
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
    product.count = 0;
    const price = product.price;
    product.total = price;
    this.setState(
      () => {
        return { product: tempProduct, cart: [...this.state.cart, product] };
      },
      () => {
        console.log(this.state);
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
  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModel: this.openModel,
          closeModel: this.closeModel
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;
export { ProductProvider, ProductConsumer };