import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link } from "react-router-dom";
import React from "react";

interface BreadcrumbWrapProps {
  pages: {
    label: string;
    path: string;
  }[];
}

const BreadcrumbWrap: React.FC<BreadcrumbWrapProps> = ({pages}) => {
  return (
    <div className="breadcrumb-area pt-35 pb-35 bg-gray-3">
      <div className="container">
        <Breadcrumb>
            {pages?.map(({ path, label }, i) => i !== pages.length - 1 ? (
                <Breadcrumb.Item key={label} linkProps={{to: path}} linkAs={Link}>
                  {label}
                </Breadcrumb.Item>
            ) : (                
              <Breadcrumb.Item key={label} active>
                {label}
              </Breadcrumb.Item>
            ))}
        </Breadcrumb>
      </div>
    </div>
  );
};

export default BreadcrumbWrap;
