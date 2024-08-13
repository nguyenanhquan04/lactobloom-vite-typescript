// Get products
export const getProducts = (
  products: any,
  type?: string,
  limit?: number
): any => {
  let finalProducts = products;

  if (type && type === "saleItems") {
    finalProducts = finalProducts.filter(
      (single: any) => single.discount && single.discount > 0
    );
  }

  return finalProducts.slice(0, limit ? limit : finalProducts.length);
};

// Get product discount price
export const getDiscountPrice = (price: number, discount?: number): number | null => {
  return discount && discount > 0 ? price - price * (discount / 100) : null;
};

// Get product cart quantity
export const getProductCartQuantity = (
  cartItems: any,
  product: any
): number => {
  const productInCart = cartItems.find(
    (single: any) => single.productId === product.productId
  );

  return productInCart ? productInCart.quantity : 0;
};

// Get cart item stock
export const cartItemStock = (item: any): number => {
  return item.stock || 0; // Default to 0 if no stock information is found
};

// Get products based on sorting
export const getSortedProducts = (
  products: any,
  sortType: any,
  sortValue: any
): any => {
  if (products && sortType && sortValue) {
    let sortedProducts = [...products];

    if (sortType === "filterSort") {
      if (sortValue === "priceHighToLow") {
        return sortedProducts.sort((a, b) => b.price - a.price);
      }
      if (sortValue === "priceLowToHigh") {
        return sortedProducts.sort((a, b) => a.price - b.price);
      }
    }
  }
  return products;
};

// Get individual item array
const getIndividualItemArray = (array: string[]): string[] => {
  return array.filter((v, i, self) => i === self.indexOf(v));
};

// Get individual categories
export const getIndividualCategories = (products: any): any => {
  let productCategories: string[] = [];
  products &&
    products.forEach((product: any) => {
      product.category &&
        product.category.forEach((single: any) => {
          productCategories.push(single);
        });
    });

  return getIndividualItemArray(productCategories);
};

// Set active sort
export const setActiveSort = (e: React.MouseEvent, filterType: string): void => {
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

  filterButtons.forEach((item) => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

// Set active layout
export const setActiveLayout = (e: React.MouseEvent): void => {
  const gridSwitchBtn = document.querySelectorAll(".shop-tab button");
  gridSwitchBtn.forEach((item) => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

// Toggle shop top filter
export const toggleShopTopFilter = (e: React.MouseEvent): void => {
  const shopTopFilterWrapper = document.querySelector("#product-filter-wrapper") as HTMLElement;
  shopTopFilterWrapper.classList.toggle("active");

  if (shopTopFilterWrapper.style.height) {
    shopTopFilterWrapper.style.height = "";
  } else {
    shopTopFilterWrapper.style.height = shopTopFilterWrapper.scrollHeight + "px";
  }
  e.currentTarget.classList.toggle("active");
};
