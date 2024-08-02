import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import React from "react";

interface BannerOneSingleProps {
    data: {
        title: string;
        subtitle: string;
        price: number;
        link: string;
        image: string;
    };
    spaceBottomClass?: string;
}

const BannerOneSingle: React.FC<BannerOneSingleProps> = ({ data, spaceBottomClass }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(data.link);
    };

    return (
        <div className={clsx("single-banner", spaceBottomClass)}>
            <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                <img src={data.image} alt={data.title} />
            </div>
            <div className="banner-content">
                <h3>{data.title}</h3>
                <h4>
                    {data.subtitle} <span>{data.price}</span>
                </h4>
                <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                    <i className="fa fa-long-arrow-right" />
                </div>
            </div>
        </div>
    );
};

export default BannerOneSingle;
