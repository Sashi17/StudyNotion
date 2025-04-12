import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import {getPwResetToken} from "../services/operations/authAPI"

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
    <div className='text-white flex items-center justify-center'>
        {
            loading ? (
                <div>Loading ...</div>
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
                                        className='text-black'/>
                                </label>
                            )
                        }
                    </form>

                    <button type='submit' onClick={handleOnSubmit}>
                        {
                            !emailSent ? ("Reset Password") : ("Resend Email")
                        }
                    </button>

                    <div>
                        <Link to="/login">
                            <p>Back to Login</p>
                        </Link>
                    </div>

                </div>
            )
        }
    </div>
  )
}
