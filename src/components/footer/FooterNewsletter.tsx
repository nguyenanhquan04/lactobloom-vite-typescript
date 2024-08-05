import clsx from "clsx";
import SubscribeEmail from "./sub-components/SubscribeEmail";
import React from "react";

interface FooterNewsletterProps {
  spaceBottomClass?: string;
  spaceLeftClass?: string;
  sideMenu?: string;
  colorClass?: string;
  widgetColorClass?: string;
}

const FooterNewsletter: React.FC<FooterNewsletterProps> = ({
  spaceBottomClass,
  spaceLeftClass,
  sideMenu,
  colorClass,
  widgetColorClass
}) => {
  return (
    <div className={clsx("footer-widget", spaceBottomClass, sideMenu ? "ml-ntv5" : spaceLeftClass, widgetColorClass)}>
      <div className="footer-title">
        <h3>ĐĂNG KÝ</h3>
      </div>
      <div className={clsx("subscribe-style", colorClass)}>
        <p>Nhận E-mail về những cập nhật mới nhất về shop và các chương trình khuyến mãi.</p>
        {/* subscribe email */}
        <SubscribeEmail mailchimpUrl="//devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef" />
      </div>
    </div>
  );
};

export default FooterNewsletter;
