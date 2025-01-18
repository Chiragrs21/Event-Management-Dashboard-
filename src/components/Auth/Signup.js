import React from "react";
import abstraction from "../../img/background.png";
import googleLogoIconPngTransparentBackgroundOsteopathy161 from "../../img/google.png";
import polygon1 from "../../img/polygon.png";
import "../../Stylesheet/Signup.css";
import vector from "../../img/home.png";
import { Link } from "react-router-dom";

const App = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log("Form submitted!");
    };

    return (
        <div className="sign-up">
            <div className="overlap-wrapper">
                <div className="overlap">
                    <div className="overlap-group">
                        <div className="rectangle" />

                        <p className="text-wrapper">
                            Share, collabrate and manage your events
                        </p>

                        <img className="abstraction" alt="Abstraction" src={abstraction} />

                        <div className="div">English (UK)</div>

                        <img className="polygon" alt="Polygon" src={polygon1} />

                        <div className="group">
                            <form onSubmit={handleSubmit}>
                                <div className="overlap-4">
                                    <input
                                        className="text-wrapper-2"
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>

                                <div className="overlap-5">
                                    <input
                                        className="text-wrapper-2"
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                    />
                                </div>

                                <div className="overlap-2">
                                    <input
                                        className="text-wrapper-2"
                                        type="password"
                                        placeholder="Password"
                                        required
                                    />
                                </div>

                                {/* <p className="allready-have-an">
                                    <span className="span">Already have an account?</span>
                                    <span className="text-wrapper-4">&nbsp;</span>
                                    <span className="text-wrapper-5">Log in</span>
                                </p> */}

                                <div className="div-wrapper">
                                    <button className="text-wrapper-8" type="submit">
                                        <Link to="/">Log in</Link>
                                    </button>
                                </div>
                            </form>

                            <div className="overlap-group-2">
                                <div className="text-wrapper-3">LogIn up with Google</div>
                                <img
                                    className="google-logo-icon-png"
                                    alt="Google logo icon png"
                                    src={googleLogoIconPngTransparentBackgroundOsteopathy161}
                                />
                                <div className="rectangle-2" />
                            </div>

                            <div className="text-wrapper-6">- OR -</div>
                        </div>
                    </div>

                    <img className="vector" alt="Vector" src={vector} />
                </div>
            </div>
        </div>
    );
};

export default App;
