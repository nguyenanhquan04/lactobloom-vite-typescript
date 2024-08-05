import clsx from "clsx";
import React from "react";

interface Data {
  image: string;
  fbLink: string;
  twitterLink: string;
  instagramLink: string;
  name: string;
  position: string;
};

interface TeamMemberOneSingleProps {
  data: Data;
  spaceBottomClass: string;
};

const TeamMemberOneSingle: React.FC<TeamMemberOneSingleProps> = ({ data, spaceBottomClass }) => {
  return (
      <div className={clsx("team-wrapper", spaceBottomClass)}>
        <div className="team-img">
          <img
            src={data.image}
            alt=""
            className="img-fluid"
          />
          <div className="team-action">
            <a
              className="facebook"
              href={data.fbLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-facebook" />
            </a>
            <a
              className="twitter"
              href={data.twitterLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-twitter" />
            </a>
            <a
              className="instagram"
              href={data.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-instagram" />
            </a>
          </div>
        </div>
        <div className="team-content text-center">
          <h4>{data.name}</h4>
          <span>{data.position} </span>
        </div>
      </div>
  );
};



export default TeamMemberOneSingle;
