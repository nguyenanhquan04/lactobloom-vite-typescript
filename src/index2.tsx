import React, { useEffect, FC } from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import ProductProvider, { useProduct } from "./store/contexts/product-context";
import CurrencyProvider from "./store/contexts/currency-context";
import CartProvider from "./store/contexts/cart-context";
import CompareProvider from "./store/contexts/compare-context";
import WishlistProvider from "./store/contexts/wishlist-context";
import { getAllProducts } from "./utils/ProductService";
import 'animate.css';
import 'swiper/swiper-bundle.min.css';
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./assets/scss/style.scss";
import "./i18n";

const Root: FC = () => {
    const { setProducts } = useProduct();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProducts();
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        fetchProducts();
    }, [setProducts]);

    return <App />;
};

const container: HTMLElement | null = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <ProductProvider>
            <CurrencyProvider>
                <CartProvider>
                    <CompareProvider>
                        <WishlistProvider>
                            <Root />
                        </WishlistProvider>
                    </CompareProvider>
                </CartProvider>
            </CurrencyProvider>
        </ProductProvider>
    );
}
