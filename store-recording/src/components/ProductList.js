import React, { Component } from "react";
import Product from "./Product";
import Title from "./Title";
import { ProductConsumer } from "./context";

export default class ProductList extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="py-5">
          <div class="container">
            <Title name= "The " title=" SmartPhone World" />
            <div class="row" />
            <ProductConsumer>
              {value => {
                return value.product.map(product => {
                  return <Product key={product.id} product={product} />;
                });
              }}
            </ProductConsumer>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
