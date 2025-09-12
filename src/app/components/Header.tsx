import "../styles/header.scss";
import { Offcanvas } from "react-bootstrap";
import { useAccount, useDisconnect } from "wagmi";
import { useState } from "react";
import { WalletButton } from "./WalletButton";
import {
  LogoIcon,
  HamburgerIcon,
  CloseIcon,
  LinktreeIcon,
} from "./icons/headericons";

const Header: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <section className="mainnavbar">
        <a href="/" className="logolink">
          <LogoIcon className="logoimg" />
        </a>

        <div className="navbtns">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="linkmain"
          >
            <LinktreeIcon />
          </a>

          {address ? (
            <button className="disconnectbtn" onClick={() => disconnect()}>
              Disconnect
            </button>
          ) : (
            <WalletButton className="connectbtn" />
          )}

          <HamburgerIcon
            className="d-none d-blockformobile"
            onClick={() => setShowSidebar(true)}
          />
        </div>
      </section>

      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
        className="payback"
      >
        <Offcanvas.Header>
          <Offcanvas.Title>
            <LogoIcon className="logosidebar" />
          </Offcanvas.Title>
          <button className="closebtn" onClick={() => setShowSidebar(false)}>
            <CloseIcon />
          </button>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <div className="innercontent">
            <button className="web">
              <LinktreeIcon />
              Linktree
            </button>
          </div>
        </Offcanvas.Body>

        <div className="endbutton">
          {address ? (
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
