import React, { useState, ChangeEvent } from "react";
import "../styles/banner.scss";
import { Modal } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DynamicModal from "./DynamicModal";

const Banner: React.FC = () => {
  // tab key
  const [key, setKey] = useState<string>("gtd");
  const [connect, setConnect] = useState<boolean>(true);

  // input value
  const [value, setValue] = useState<number | "">(1);

  // Mint successful
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const handleCloseSuccess = () => setShowSuccess(false);
  const handleShowSuccess = () => setShowSuccess(true);

  // Mint unsuccessful
  const [showFailure, setShowFailure] = useState<boolean>(false);
  const handleCloseFailure = () => setShowFailure(false);
  const handleShowFailure = () => setShowFailure(true);

  const decrease = () => {
    if (typeof value === "number" && value > 1) {
      setValue(value - 1);
    }
  };

  const increase = () => {
    if (typeof value === "number") {
      setValue(value + 1);
    }
  };

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setValue(newValue === "" ? "" : parseInt(newValue, 10));
    }
  };

  return (
    <>
      <section className="mainbanner">
        {/* Background images */}
        <img
          src="/assets/bannerbg.png"
          alt="bannerbg"
          className="bannerbg d-noneformobile"
        />
        <img
          src="/assets/bannerbgmbl.png"
          alt="bannerbg"
          className="bannerbg d-none d-blockformobile"
        />

        {/* Right side */}
        <div className="rightman">
          <div className="innertexts">
            <h6 className="numbers">1023/3000</h6>
            <h1 className="mintedhead">Minted</h1>
          </div>
          <img
            src="/assets/rightman.png"
            alt="rightmanimg"
            className="rightmanimg"
          />
        </div>

        {/* Tabs */}
        <div className="bannertexts">
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => k && setKey(k)}
            className="bannertabs"
          >
            <Tab eventKey="gtd" title="GTD">
              <h1 className="whitlisthead">GTD</h1>
              {!connect && (
                <>
                  <div className="maininput">
                    <button className="signbutton" onClick={decrease}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="49"
                        height="49"
                        viewBox="0 0 49 49"
                        fill="none"
                      >
                        <path
                          d="M12.5 24.5H36.5"
                          stroke="#121212"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                    <input
                      value={value}
                      onChange={handleChangeValue}
                      placeholder="1"
                      type="text"
                      className="numberinput"
                    />
                    <button className="signbutton" onClick={increase}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="49"
                        height="49"
                        viewBox="0 0 49 49"
                        fill="none"
                      >
                        <path
                          d="M12.5 24.5H36.5"
                          stroke="#121212"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M24.5 36.5V12.5"
                          stroke="#121212"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="details">
                    <p className="detailpara">Price: 0.03 ETH</p>
                    <p className="detailpara">Total: 0.03 ETH</p>
                  </div>
                </>
              )}
              <div className="maingtd">
                <div className="innergtd">
                  <p className="gtdpara">Start time</p>
                  <h6 className="gtdhead">
                    {!connect && <span>27th Aug</span>}
                    14:18:13
                    {!connect && <span>EST</span>}
                  </h6>
                </div>
                <div className="innergtd">
                  <p className="gtdpara">Time remaining</p>
                  <h6 className="gtdhead">TBD</h6>
                </div>
              </div>
              {connect && (
                <p className="publicpara">public mint starts in 2 days</p>
              )}
              {connect ? (
                <button
                  className="connectbtn"
                  onClick={() => {
                    setConnect(!connect);
                  }}
                >
                  Connect Wallet
                </button>
              ) : (
                // dullbtn is the other class
                <button className="mintbtn" onClick={handleShowSuccess}>
                  Mint now
                </button>
              )}
              {/* redspan is the other class  */}
              {!connect && (
                <span className="eligiblespan">
                  You are eligible to Mint NFT
                </span>
              )}
            </Tab>

            <Tab eventKey="fcfs" title="FCFS">
              <h1 className="whitlisthead">FCFS</h1>
              {!connect && (
                <>
                  <div className="maininput">
                    <button className="signbutton" onClick={decrease}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="49"
                        height="49"
                        viewBox="0 0 49 49"
                        fill="none"
                      >
                        <path
                          d="M12.5 24.5H36.5"
                          stroke="#121212"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                    <input
                      value={value}
                      onChange={handleChangeValue}
                      placeholder="1"
                      type="text"
                      className="numberinput"
                    />
                    <button className="signbutton" onClick={increase}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="49"
                        height="49"
                        viewBox="0 0 49 49"
                        fill="none"
                      >
                        <path
                          d="M12.5 24.5H36.5"
                          stroke="#121212"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M24.5 36.5V12.5"
                          stroke="#121212"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="details">
                    <p className="detailpara">Price: 0.03 ETH</p>
                    <p className="detailpara">Total: 0.03 ETH</p>
                  </div>
                </>
              )}
              <div className="maingtd">
                <div className="innergtd">
                  <p className="gtdpara">Start time</p>
                  <h6 className="gtdhead">
                    {!connect && <span>27th Aug</span>}
                    14:18:13
                    {!connect && <span>EST</span>}
                  </h6>
                </div>
                <div className="innergtd">
                  <p className="gtdpara">Time remaining</p>
                  <h6 className="gtdhead">TBD</h6>
                </div>
              </div>
              {connect && (
                <p className="publicpara">public mint starts in 2 days</p>
              )}
              {connect ? (
                <button
                  className="connectbtn"
                  onClick={() => {
                    setConnect(!connect);
                  }}
                >
                  Connect Wallet
                </button>
              ) : (
                // dullbtn is the other class
                <button className="mintbtn" onClick={handleShowSuccess}>
                  Mint now
                </button>
              )}
              {/* redspan is the other class  */}
              {!connect && (
                <span className="eligiblespan">
                  You are eligible to Mint NFT
                </span>
              )}
            </Tab>

            <Tab eventKey="public" title="Public">
              <h1 className="whitlisthead">Public</h1>
              {!connect && (
                <>
                  <div className="maininput">
                    <button className="signbutton" onClick={decrease}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="49"
                        height="49"
                        viewBox="0 0 49 49"
                        fill="none"
                      >
                        <path
                          d="M12.5 24.5H36.5"
                          stroke="#121212"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                    <input
                      value={value}
                      onChange={handleChangeValue}
                      placeholder="1"
                      type="text"
                      className="numberinput"
                    />
                    <button className="signbutton" onClick={increase}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="49"
                        height="49"
                        viewBox="0 0 49 49"
                        fill="none"
                      >
                        <path
                          d="M12.5 24.5H36.5"
                          stroke="#121212"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M24.5 36.5V12.5"
                          stroke="#121212"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="details">
                    <p className="detailpara">Price: 0.03 ETH</p>
                    <p className="detailpara">Total: 0.03 ETH</p>
                  </div>
                </>
              )}
              <div className="maingtd">
                <div className="innergtd">
                  <p className="gtdpara">Start time</p>
                  <h6 className="gtdhead">
                    {!connect && <span>27th Aug</span>}
                    14:18:13
                    {!connect && <span>EST</span>}
                  </h6>
                </div>
                <div className="innergtd">
                  <p className="gtdpara">Time remaining</p>
                  <h6 className="gtdhead">TBD</h6>
                </div>
              </div>
              {connect && (
                <p className="publicpara">public mint starts in 2 days</p>
              )}
              {connect ? (
                <button
                  className="connectbtn"
                  onClick={() => {
                    setConnect(!connect);
                  }}
                >
                  Connect Wallet
                </button>
              ) : (
                // dullbtn is the other class
                <button className="mintbtn" onClick={handleShowSuccess}>
                  Mint now
                </button>
              )}
              {/* redspan is the other class  */}
              {!connect && (
                <span className="eligiblespan">
                  You are eligible to Mint NFT
                </span>
              )}
            </Tab>
          </Tabs>
        </div>
      </section>

      <DynamicModal
        show={showSuccess}
        onHide={handleCloseSuccess}
        type="success"
      />

      <DynamicModal
        show={showFailure}
        onHide={handleCloseFailure}
        type="failure"
      />
    </>
  );
};

export default Banner;
