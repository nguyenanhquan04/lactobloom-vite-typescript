import clsx from "clsx";
import React from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SectionTitle from "../../components/section-title/SectionTitle";
import ProductGrid from "./ProductGrid";

interface TabProductProps {
  bgColorClass?: string;
  spaceBottomClass?: string;
  spaceTopClass?: string;
};

const TabProduct: React.FC<TabProductProps> = ({
  spaceTopClass,
  spaceBottomClass,
  bgColorClass
}) => {
  return (
    <div
      className={clsx("product-area", spaceTopClass, spaceBottomClass, bgColorClass)}
    >
      <div className="container">
        <SectionTitle titleText="SẢN PHẨM BÁN CHẠY" positionClass="text-center" />
        <Tab.Container defaultActiveKey="saleItems">
          <Nav
            variant="pills"
            className="product-tab-list pt-30 pb-55 text-center"
          >
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="saleItems">
              <div className="row">
                <ProductGrid
                  type="saleItems"
                  limit={8}
                  spaceBottomClass="mb-25"
                />
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

export default TabProduct;
