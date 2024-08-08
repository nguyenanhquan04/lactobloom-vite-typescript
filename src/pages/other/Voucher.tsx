import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { getAvailableVoucher, exchangeVoucher } from "../../utils/VoucherService";
import Cookies from "js-cookie"; // Import js-cookie
import {jwtDecode} from "jwt-decode";

const Voucher = () => {
  let { pathname } = useLocation();
  let navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const authToken = Cookies.get('authToken'); // Get authToken from cookies

    // Check for authToken cookie and redirect to homepage if it exists
    useEffect(() => {
      const token = Cookies.get("authToken");
      if (token) {
        const decodedToken = jwtDecode<any>(token);
        const userRole = decodedToken.role;
        if (userRole !== "MEMBER") {
          navigate("/admin");
        } 
      }
    }, [navigate]);

  useEffect(() => {
    // Fetch vouchers from the API
    const fetchVouchers = async () => {
      try {
        const response = await getAvailableVoucher();
        setVouchers(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
  }, []);

  const handleExchange = async (voucherId : number) => {
    try {
      const response = await exchangeVoucher(voucherId, { headers: { Authorization: `Bearer ${authToken}` } });
      alert(response.data);
      if (!authToken) {
        navigate('/login');
      }
      window.location.reload(); 
    } catch (error) {
      console.error("Error exchanging voucher:", error);
    }
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Mã giảm giá"
        description="Lactobloom Voucher Exchange."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            { label: "Trang chủ", path: import.meta.env.VITE_PUBLIC_URL + "/" },
            { label: "Mã giảm giá", path: import.meta.env.VITE_PUBLIC_URL + pathname }
          ]} 
        />

        {/* Voucher List */}
        <div className="voucher-list">
          {vouchers.length > 0 ? (
            vouchers.map((voucher: any) => (
              <div key={voucher.voucherId} className="voucher">
                <div className="voucher-details">
                  <h3>Giảm giá {voucher.discount}%</h3>
                  <p>Ngày hết hạn: {voucher.expirationDate}</p>
                  <p>Số điểm cần: {voucher.point}</p>
                </div>
                <button className="redeem-button" onClick={() => handleExchange(voucher.voucherId)}>Đổi</button>
              </div>
            ))
          ) : (
            <h1>Không có mã giảm giá</h1>
          )}
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Voucher;
