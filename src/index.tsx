import React, { useEffect, FC } from "react";
import { createRoot } from 'react-dom/client';
import { useDispatch, Provider } from 'react-redux';
import App from "./App";
import { store } from "./store/store";
import PersistProvider from "./store/providers/persist-provider";
import { setProducts } from "./store/slices/product-slice";
import { useProduct } from "./store/contexts/product-context";
import { getAllProducts } from "./utils/ProductService";
import CartProvider from './store/contexts/cart-context';
import WishlistProvider from "./store/contexts/wishlist-context";
import CompareProvider from "./store/contexts/compare-context";
import ProductProvider from "./store/contexts/product-context";
import 'animate.css';
import 'swiper/swiper-bundle.min.css';
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./assets/scss/style.scss";
import "./i18n";

interface RootProps {}

const Root: FC<RootProps> = () => {
    const { setProduct } = useProduct();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProducts();
                setProduct(response.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        fetchProducts();
    }, [dispatch]);

    return (
        <PersistProvider>
            <CartProvider>
                <WishlistProvider>
                    <CompareProvider>
                        <ProductProvider>
                            <App />
                        </ProductProvider>
                    </CompareProvider>
                    </WishlistProvider>
            </CartProvider>
        </PersistProvider>
    );
};

const container: HTMLElement | null = document.getElementById('root');
if (container) {
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <ProductProvider>
            <Root />
        </ProductProvider>
    </Provider>
);
}
