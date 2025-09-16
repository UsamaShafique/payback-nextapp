import React, { FC } from "react";
import { Modal } from "react-bootstrap";
import { getTokenExplorerUrl } from "../utils/helpers";

type DynamicModalProps = {
  show: boolean;
  onHide: () => void;
  type: "success" | "failure";
  mintedId?: string;
  errorMessage?: string | null;
};

const DynamicModal: FC<DynamicModalProps> = ({
  show,
  onHide,
  type,
  errorMessage,
  mintedId,
}) => {
  const isSuccess = type === "success";
  const mintedIds = mintedId ? mintedId?.split(",")?.map((id) => id.trim()) : [];

  return (
    <Modal show={show} onHide={onHide} centered className="bannermodal">
      <Modal.Body>
        <button className="closebtn" onClick={onHide}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="69"
            height="69"
            viewBox="0 0 69 69"
            fill="none"
          >
            <path
              d="M21.5811 21.5811L47.9998 47.9998"
              stroke="#121212"
              strokeWidth="5"
              strokeLinecap="square"
              strokeLinejoin="round"
            />
            <path
              d="M21.5813 47.9998L48 21.5811"
              stroke="#121212"
              strokeWidth="5"
              strokeLinecap="square"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isSuccess ? (
          <>
            <img
              src="/assets/modalhappyimg.png"
              alt="modalimg"
              className="modalimg d-noneformobile"
            />
            <img
              src="/assets/modalhappyimg.png"
              alt="modalimg"
              className="modalimg d-none d-blockformobile"
            />
          </>
        ) : (
          <img
            src="/assets/modaunhappy.png"
            alt="modalimg"
            className="modalimg"
          />
        )}

        <div
          className="modaltexts"
          style={!isSuccess ? { marginTop: "9.027vw" } : {}}
        >
          <h1 className="modalhead">
            {isSuccess ? "Mint successful!" : "Mint UNsuccessful!"}
          </h1>
          {!isSuccess && errorMessage && (
            <p className="modalpara">{errorMessage}</p>
          )}

          {isSuccess && (
            <>
              <p className="modalpara">
                {mintedIds?.map((id) => `#${id?.trim()}`)?.join(", ")}
              </p>
              <div className="modalbtns">
                {mintedIds?.length > 0 && (
                  <a
                    href={getTokenExplorerUrl(mintedIds[0])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="innerbtn"
                    style={{ textDecoration: "none" }}
                  >
                    View explorer
                  </a>
                )}

                <button className="innerbtn" disabled>
                  View collection
                </button>
              </div>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DynamicModal;
