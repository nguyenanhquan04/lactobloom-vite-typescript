import React, { useEffect, FC } from "react";
import { createRoot } from 'react-dom/client';
import { useDispatch, Provider } from 'react-redux';
import App from "./App";
import { store } from "./store/store";
import PersistProvider from "./store/providers/persist-provider";
import { setProducts } from "./store/slices/product-slice";
import { getAllProducts } from "./utils/ProductService";
import 'animate.css';
import 'swiper/swiper-bundle.min.css';
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./assets/scss/style.scss";
import "./i18n";

interface RootProps {}

const Root: FC<RootProps> = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProducts();
                dispatch(setProducts(response.data));
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        fetchProducts();
    }, [dispatch]);

    return (
        <PersistProvider>
            <App />
        </PersistProvider>
    );
};

const container: HTMLElement | null = document.getElementById('root');
if (container) {
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <Root />
    </Provider>
);
}
