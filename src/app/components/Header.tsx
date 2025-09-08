import "../styles/header.scss";
import { Offcanvas } from "react-bootstrap";
import { useAccount, useDisconnect } from "wagmi";
import { useState } from "react";
import { WalletButton } from "./WalletButton";

const Header: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <section className="mainnavbar">
        <a href="/" className="logolink">
          <img src="/assets/logo.png" alt="logoimg" className="logoimg" />
        </a>
        <div className="navbtns">
          <a
            href="/"
            target="_blank"
            className="linkmain"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="30"
              viewBox="0 0 24 30"
              fill="none"
            >
              <g clip-path="url(#clip0_83_99)">
                <path
                  d="M0.06 10.1638H7.32L2.13 5.12794L4.98 2.18014L9.9 7.30809V0H14.16V7.30809L19.08 2.18014L21.93 5.12794L16.74 10.1331H24V14.2784H16.71L21.9 19.4063L19.05 22.2927L12 15.0768L4.95 22.3234L2.1 19.4063L7.29 14.2784H0V10.1638H0.06ZM9.93 20.2047H14.19V30.0307H9.93V20.2047Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_83_99">
                  <rect width="24" height="30" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </a>
          {isConnected ? (
            <button className="disconnectbtn" onClick={() => disconnect()}>
              Disconnect
            </button>
          ) : (
            <WalletButton className="connectbtn" />
          )}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            className="d-none d-blockformobile"
            onClick={handleShowSidebar}
          >
            <path
              d="M24.7 14.3H1.3C0.955219 14.3 0.624559 14.163 0.380761 13.9192C0.136964 13.6755 0 13.3448 0 13C0 12.6552 0.136964 12.3246 0.380761 12.0808C0.624559 11.837 0.955219 11.7 1.3 11.7H24.7C25.0448 11.7 25.3755 11.837 25.6192 12.0808C25.863 12.3246 26 12.6552 26 13C26 13.3448 25.863 13.6755 25.6192 13.9192C25.3755 14.163 25.0448 14.3 24.7 14.3ZM24.7 5.2H1.3C0.955219 5.2 0.624559 5.06303 0.380761 4.81924C0.136964 4.57544 0 4.24479 0 3.9C0 3.55521 0.136964 3.22456 0.380761 2.98076C0.624559 2.73697 0.955219 2.6 1.3 2.6H24.7C25.0448 2.6 25.3755 2.73697 25.6192 2.98076C25.863 3.22456 26 3.55521 26 3.9C26 4.24479 25.863 4.57544 25.6192 4.81924C25.3755 5.06303 25.0448 5.2 24.7 5.2ZM24.7 23.4H1.3C0.955219 23.4 0.624559 23.263 0.380761 23.0192C0.136964 22.7755 0 22.4448 0 22.1C0 21.7552 0.136964 21.4245 0.380761 21.1808C0.624559 20.937 0.955219 20.8 1.3 20.8H24.7C25.0448 20.8 25.3755 20.937 25.6192 21.1808C25.863 21.4245 26 21.7552 26 22.1C26 22.4448 25.863 22.7755 25.6192 23.0192C25.3755 23.263 25.0448 23.4 24.7 23.4Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      <Offcanvas
        className="payback"
        show={showSidebar}
        onHide={handleCloseSidebar}
        placement="start"
      >
        <Offcanvas.Header>
          <Offcanvas.Title>
            <img src="/assets/logo.png" alt="img" className="logosidebar" />
          </Offcanvas.Title>
          <button className="closebtn" onClick={handleCloseSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
            >
              <path
                d="M10.7749 10.5328L23.7928 23.5508"
                stroke="#121212"
                stroke-width="2.46377"
                stroke-linecap="square"
                stroke-linejoin="round"
              />
              <path
                d="M10.775 23.5508L23.793 10.5328"
                stroke="#121212"
                stroke-width="2.46377"
                stroke-linecap="square"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="innercontent">
            <button className="web">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="30"
                viewBox="0 0 25 30"
                fill="none"
              >
                <g clip-path="url(#clip0_26_619)">
                  <path
                    d="M0.56 10.1638H7.82L2.63 5.12794L5.48 2.18014L10.4 7.30809V0H14.66V7.30809L19.58 2.18014L22.43 5.12794L17.24 10.1331H24.5V14.2784H17.21L22.4 19.4063L19.55 22.2927L12.5 15.0768L5.45 22.3234L2.6 19.4063L7.79 14.2784H0.5V10.1638H0.56ZM10.43 20.2047H14.69V30.0307H10.43V20.2047Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_26_619">
                    <rect
                      width="24"
                      height="30"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              Linktree
            </button>
          </div>
        </Offcanvas.Body>
        <div className="endbutton">
          {isConnected ? (
            <button className="disconnect" onClick={() => disconnect()}>
              Disconnect
            </button>
          ) : (
            <WalletButton className="connectbtn" />
          )}
        </div>
      </Offcanvas>
    </>
  );
};

export default Header;
