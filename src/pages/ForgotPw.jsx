import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import {getPwResetToken} from "../services/operations/authAPI"
import { BiArrowBack } from "react-icons/bi"

export const ForgotPw = () => {
    //the 2 pages are shown on basis of email sent or not
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();

    const {loading} = useSelector(state => state.auth);
    
    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(getPwResetToken(email, setEmailSent));
    }

    return (
    <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
        {
            loading ? (
                <div className="spinner"></div>
            ) : (
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                        { 
                            !emailSent ? ("Reset Your Password") : ("Check Your Email")
                        }
                    </h1>

                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                        {
                            !emailSent ? ("Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery") 
                            : (`We have sent the reset email to ${email}`) 
                        }
                    </p>

                    <form onSubmit={handleOnSubmit}>
                        {
                            !emailSent && (
                                <label>
                                    <p> Email Address: </p>
                                    <input 
                                        required
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='Enter your Email Address'
                                        className='form-style w-full'/>
                                </label>
                            )
                        }
                    </form>

                    <button type='submit' onClick={handleOnSubmit}
                        className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900">
                        {
                            !emailSent ? ("Reset Password") : ("Resend Email")
                        }
                    </button>

                    <div className="mt-6 flex items-center justify-between">
                        <Link to="/login">
                            <p className="flex items-center gap-x-2 text-richblack-5">
                                <BiArrowBack />Back to Login</p>
                        </Link>
                    </div>

                </div>
            )
        }
    </div>
  )
}
