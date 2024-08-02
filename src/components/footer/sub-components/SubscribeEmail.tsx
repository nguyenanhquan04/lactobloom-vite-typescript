import React, { useRef } from "react";
import MailchimpSubscribe from "react-mailchimp-subscribe";

interface SubscribeEmailProps {
  mailchimpUrl: string;
}

interface CustomFormProps {
  status: string;
  message: string;
  onValidated: (formData: { EMAIL: string }) => void;
}

const CustomForm: React.FC<CustomFormProps> = ({ status, message, onValidated }) => {
  const emailRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (emailRef.current && emailRef.current.value.indexOf("@") > -1) {
      onValidated({
        EMAIL: emailRef.current.value,
      });

      // Clear the input field
      emailRef.current.value = "";
    }
  };

  return (
    <div className="subscribe-form">
      <div className="mc-form">
        <div>
          <input
            id="mc-form-email"
            className="email"
            ref={emailRef}
            type="email"
            placeholder="Nhập địa chỉ email của bạn..."
          />
        </div>
        <div className="clear">
          <button className="button" onClick={submit}>
            ĐĂNG kÝ
          </button>
        </div>
      </div>

      {status === "sending" && (
        <div style={{ color: "#3498db", fontSize: "12px" }}>Đang gửi...</div>
      )}
      {status === "error" && (
        <div
          style={{ color: "#e74c3c", fontSize: "12px" }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {status === "success" && (
        <div
          style={{ color: "#2ecc71", fontSize: "12px" }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
    </div>
  );
};

const SubscribeEmail: React.FC<SubscribeEmailProps> = ({ mailchimpUrl }) => {
  return (
    <div>
      <MailchimpSubscribe
        url={mailchimpUrl}
        render={({ subscribe, status, message }) => (
          <CustomForm
            status={status}
            message={message}
            onValidated={formData => subscribe(formData)}
          />
        )}
      />
    </div>
  );
};

export default SubscribeEmail;
