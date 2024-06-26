import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ForgotOtp.css';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import { useUser } from '../contexts/userContext';
import otpImage from '../images/OtpImage.svg';

export default function ForgotPwd() {
    const { user } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
        if (user.emailId === 'na' || user.emailId === '' || user.emailId === undefined) {
            navigate('/login');
        }
    }, [])
    const location = useLocation();
    const [success, setSuccess] = useState(false);
    const [limit, setLimit] = useState(3);
    const state = location.state || {};
    const [message, setMessage] = useState('');
    const [data, setData] = useState({
        otp: ''
    })

    const handleresend = async (e) => {

        e.preventDefault();
        try {
            const response = await authService.resendotpmail(state.email);
            setMessage(response.data.message);
            setSuccess(response.data.success);
            const otp = response.data.otp;
            state.otp = otp;

        } catch (err) {
            if (!err.response) {
                setMessage("Internal Server Error, Please try again later !");
                setSuccess(false);
                return;
            }
            setMessage(err.response.data.message)
            setSuccess(false);
            setTimeout(() => {
                setMessage('');
            }, 2500);
        }

    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.otp === state.otp.toString()) {
            setMessage('OTP verified successfully redirecting to reset password page');
            setSuccess(true);
            setTimeout(() => {
                setMessage('');
                navigate('/resetpwd');
            }, 1500);

        } else {
            setMessage('Oops! OTP not matched. Please try again.You have ' + limit + ' attempts left');
            setLimit(limit - 1);
            if (limit === 0) {
                setMessage('You have exceeded the limit. Please try again later');
                setTimeout(() => {
                    setMessage('');
                    navigate('/forgotpwd');
                }, 1500);
            }
        }
    }
    return (
        <div>
            <div className="back-btn-container">
                <Link
                    exact="true" to="/forgotpwd"
                    className="back-btn">
                    &lt;  Back
                </Link>
            </div>
            <div className="forgot-otp-container">
                <div className="forgot-otp-image-container">
                    <img
                        src={otpImage}
                        alt="otp" />
                </div>
                <div className="forgot-otp-form-container">

                    <div className="forgot-otp-form">
                        <div className='forgot-otpvertxt'>Verify OTP</div>
                        <p
                            className='forgot-otpauthtxt'>
                            An authentication code has been sent to your email. {user.emailId}
                        </p>

                        <form className="forgot-otp-form" onSubmit={handleSubmit}   >
                            <div className="forgot-otp-form-group">
                                <label
                                    htmlFor="username">

                                </label>
                                <input
                                    type="text"
                                    name="forgot-otp"
                                    id="forgot-otp"
                                    value={data.otp}
                                    onChange={(e) => {
                                        setData({ otp: e.target.value });
                                        setMessage('');
                                    }}
                                    placeholder="Enter your otp"
                                    required />
                            </div>
                            <div className='Message' style={success ? { 'color': 'green' } : { 'color': 'red' }}>
                                {message}
                            </div>

                            <p
                                className='forgot-otprestxt'>
                                Didn't receive a code(check Junk box)?
                                <button
                                    onClick={handleresend} >
                                    Resend.
                                </button>
                            </p>
                            <div className="forgot-otp">
                                <button
                                    type="submit"
                                    className='forgot-otpBtn'>
                                    Verify
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
