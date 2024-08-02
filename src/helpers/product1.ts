// get products
export const getProducts = (products: any[], type: string, limit: number): any[] => {
    let finalProducts = products;
  
    if (type && type === "saleItems") {
      finalProducts = finalProducts.filter(
        single => single.discount && single.discount > 0
      );
    }
  
    return finalProducts.slice(0, limit ? limit : finalProducts.length);
  };
  
  // get product discount price
  export const getDiscountPrice = (price: number, discount: number): number | null => {
    return discount && discount > 0 ? price - price * (discount / 100) : null;
  };
  
  // get product cart quantity
  export const getProductCartQuantity = (cartItems: any[], product: any, color: string, size: string): number => {
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
  
  export const cartItemStock = (item: any): number => {
    if (item.stock) {
      return item.stock || 0 as number; 
    }
    return 0; // Default to 0 if no stock information is found
  };
  
  // get products based on category
  export const getSortedProducts = (products: any[], sortType: string, sortValue: string): any[] => {
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
  const getIndividualItemArray = (array: any[]): any[] => {
    let individualItemArray = array.filter(function(v, i, self) {
      return i === self.indexOf(v);
    });
    return individualItemArray;
  };
  
  // get individual categories
  export const getIndividualCategories = (products: any[]): any[] => {
    let productCategories: any[] = [];
    products &&
      products.map(product => {
        return (
          product.category &&
          product.category.map((single: any) => {
            return productCategories.push(single);
          })
        );
      });
    const individualProductCategories = getIndividualItemArray(productCategories);
    return individualProductCategories;
  };
  
  // get individual tags
  export const getIndividualTags = (products: any[]): any[] => {
    let productTags: any[] = [];
    products &&
      products.map(product => {
        return (
          product.tag &&
          product.tag.map((single: any) => {
            return productTags.push(single);
          })
        );
      });
    const individualProductTags = getIndividualItemArray(productTags);
    return individualProductTags;
  };
  
  // get individual colors
  export const getIndividualColors = (products: any[]): any[] => {
    let productColors: any[] = [];
    products &&
      products.map(product => {
        return (
          product.variation &&
          product.variation.map((single: any) => {
            return productColors.push(single.color);
          })
        );
      });
    const individualProductColors = getIndividualItemArray(productColors);
    return individualProductColors;
  };
  
  // get individual sizes
  export const getProductsIndividualSizes = (products: any[]): any[] => {
    let productSizes: any[] = [];
    products &&
      products.map(product => {
        return (
          product.variation &&
          product.variation.map((single: any) => {
            return single.size.map((single: any) => {
              return productSizes.push(single.name);
            });
          })
        );
      });
    const individualProductSizes = getIndividualItemArray(productSizes);
    return individualProductSizes;
  };
  
  // get product individual sizes
  export const getIndividualSizes = (product: any): any[] => {
    let productSizes: any[] = [];
    product.variation &&
      product.variation.map((singleVariation: any) => {
        return (
          singleVariation.size &&
          singleVariation.size.map((singleSize: any) => {
            return productSizes.push(singleSize.name);
          })
        );
      });
    const individualSizes = getIndividualItemArray(productSizes);
    return individualSizes;
  };
  
  export const setActiveSort = (e: Event, filterType: string): void => {
    let filterButtons: NodeListOf<Element>;
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
    (e.currentTarget as HTMLElement).classList.add("active");
  };
  
  export const setActiveLayout = (e: Event): void => {
    const gridSwitchBtn = document.querySelectorAll(".shop-tab button");
    gridSwitchBtn.forEach(item => {
      item.classList.remove("active");
    });
    (e.currentTarget as HTMLElement).classList.add("active");
  };
  
  export const toggleShopTopFilter = (e: Event): void => {
    const shopTopFilterWrapper = document.querySelector(
      "#product-filter-wrapper"
    ) as HTMLElement | null; // Explicitly type as HTMLElement or null
  
    if (shopTopFilterWrapper) { // Ensure shopTopFilterWrapper is not null
      shopTopFilterWrapper.classList.toggle("active");
      
      // Safely handle style.height property
      if (shopTopFilterWrapper.style.height) {
        shopTopFilterWrapper.style.height = "";
      } else {
        shopTopFilterWrapper.style.height = shopTopFilterWrapper.scrollHeight + "px";
      }
      
      (e.currentTarget as HTMLElement).classList.toggle("active");
    }
  };
  
  
  
  