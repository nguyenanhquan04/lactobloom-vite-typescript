
// get products
export const getProducts = (products, type, limit) => {
  let finalProducts = products;

  if (type && type === "saleItems") {
    finalProducts = finalProducts.filter(
      single => single.discount && single.discount > 0
    );
  }

  return finalProducts.slice(0, limit ? limit : finalProducts.length);
};

// get product discount price
export const getDiscountPrice = (price, discount) => {
  return discount && discount > 0 ? price - price * (discount / 100) : null;
};



// get product cart quantity
export const getProductCartQuantity = (cartItems, product, color, size) => {
  let productInCart = cartItems.find(
    single =>
      single.productId === product.productId &&
      (single.selectedProductColor
        ? single.selectedProductColor === color
        : true) &&
      (single.selectedProductSize ? single.selectedProductSize === size : true)
  );
  if (cartItems.length >= 1 && productInCart) {
    if (product.variation) {
      return cartItems.find(
        single =>
          single.productId === product.productId &&
          single.selectedProductColor === color &&
          single.selectedProductSize === size
      ).quantity;
    } else {
      return cartItems.find(single => product.productId === single.productId).quantity;
    }
  } else {
    return 0;
  }
};

export const cartItemStock = (item) => {
  if (item.stock) {
    return item.stock; 
  }
  return 0; // Default to 0 if no stock information is found
};


//get products based on category
export const getSortedProducts = (products, sortType, sortValue) => {
  if (products && sortType && sortValue) {
    if (sortType === "filterSort") {
      let sortProducts = [...products];
      if (sortValue === "default") {
        return sortProducts;
      }
      if (sortValue === "priceHighToLow") {
        return sortProducts.sort((a, b) => {
          return b.price - a.price;
        });
      }
      if (sortValue === "priceLowToHigh") {
        return sortProducts.sort((a, b) => {
          return a.price - b.price;
        });
      }
    }
  }
  return products;
};

// get individual element
const getIndividualItemArray = array => {
  let individualItemArray = array.filter(function(v, i, self) {
    return i === self.indexOf(v);
  });
  return individualItemArray;
};

// get individual categories
export const getIndividualCategories = products => {
  let productCategories = [];
  products &&
    products.map(product => {
      return (
        product.category &&
        product.category.map(single => {
          return productCategories.push(single);
        })
      );
    });
  const individualProductCategories = getIndividualItemArray(productCategories);
  return individualProductCategories;
};

// get individual tags
export const getIndividualTags = products => {
  let productTags = [];
  products &&
    products.map(product => {
      return (
        product.tag &&
        product.tag.map(single => {
          return productTags.push(single);
        })
      );
    });
  const individualProductTags = getIndividualItemArray(productTags);
  return individualProductTags;
};

// get individual colors
export const getIndividualColors = products => {
  let productColors = [];
  products &&
    products.map(product => {
      return (
        product.variation &&
        product.variation.map(single => {
          return productColors.push(single.color);
        })
      );
    });
  const individualProductColors = getIndividualItemArray(productColors);
  return individualProductColors;
};

// get individual sizes
export const getProductsIndividualSizes = products => {
  let productSizes = [];
  products &&
    products.map(product => {
      return (
        product.variation &&
        product.variation.map(single => {
          return single.size.map(single => {
            return productSizes.push(single.name);
          });
        })
      );
    });
  const individualProductSizes = getIndividualItemArray(productSizes);
  return individualProductSizes;
};

// get product individual sizes
export const getIndividualSizes = product => {
  let productSizes = [];
  product.variation &&
    product.variation.map(singleVariation => {
      return (
        singleVariation.size &&
        singleVariation.size.map(singleSize => {
          return productSizes.push(singleSize.name);
        })
      );
    });
  const individualSizes = getIndividualItemArray(productSizes);
  return individualSizes;
};

// export const setActiveSort = e => {
//   const filterButtons = document.querySelectorAll(
//     ".sidebar-widget-list-left button, .sidebar-widget-tag button, .product-filter button"
//   );
//   filterButtons.forEach(item => {
//     item.classList.remove("active");
//   });
//   e.currentTarget.classList.add("active");
// };

export const setActiveSort = (e, filterType) => {
  let filterButtons;
  if (filterType === "category") {
    filterButtons = document.querySelectorAll(".sidebar-widget-list-left.category button");
  } else if (filterType === "brand") {
    filterButtons = document.querySelectorAll(".sidebar-widget-list-left.brand button");
  } else {
    filterButtons = document.querySelectorAll(
      ".sidebar-widget-list-left button, .sidebar-widget-tag button, .product-filter button"
    );
  }
  
  filterButtons.forEach(item => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};


export const setActiveLayout = e => {
  const gridSwitchBtn = document.querySelectorAll(".shop-tab button");
  gridSwitchBtn.forEach(item => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

export const toggleShopTopFilter = e => {
  const shopTopFilterWrapper = document.querySelector(
    "#product-filter-wrapper"
  );
  shopTopFilterWrapper.classList.toggle("active");
  if (shopTopFilterWrapper.style.height) {
    shopTopFilterWrapper.style.height = null;
  } else {
    shopTopFilterWrapper.style.height =
      shopTopFilterWrapper.scrollHeight + "px";
  }
  e.currentTarget.classList.toggle("active");
};
