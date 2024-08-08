import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom"; 
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const NotFound = () => {
  let { pathname } = useLocation();

  return (
    <Fragment>
      <SEO
        titleTemplate="Not Found"
        description="Lactobloom 404."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Trang chủ", path: import.meta.env.VITE_PUBLIC_URL + "/" },
            {label: "404", path: import.meta.env.VITE_PUBLIC_URL + pathname }
          ]} 
        />
        <div className="error-area pt-40 pb-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-8 text-center">
                <div className="error">
                  <h1>404</h1>
                  <h2>OOPS! TRANG KHÔNG TỒN TẠI</h2>
                  <p>
                  Rất tiếc nhưng trang bạn đang tìm kiếm không tồn tại, đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
                  </p>
                  <Link to={import.meta.env.VITE_PUBLIC_URL + "/"} className="error-btn">
                    Về trang chủ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default NotFound;
