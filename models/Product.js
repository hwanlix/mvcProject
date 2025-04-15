class Product {
    static #products = [];
  
    constructor(name, description) {
      this.name = name;
      this.description = description;
    }
  
    static getAll() {
      return Product.#products;
    }
  
    static add(product) {
      Product.#products.push(product);
    }
  
    static findByName(name) {
      return Product.#products.find(p => p.name === name);
    }
  
    static deleteByName(name) {
      const index = Product.#products.findIndex(p => p.name === name);
      if (index !== -1) {
        Product.#products.splice(index, 1);
      }
    }
  
    static getLast() {
      return Product.#products[Product.#products.length - 1];
    }
  }
  
  module.exports = Product;
  