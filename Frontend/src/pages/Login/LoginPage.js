import './LoginPage.css';
import React, { useState } from 'react';
import { LoginApi } from '../../services/Api';
import { storeUserData } from '../../services/Storage';
import { isAuthenticated } from '../../services/Auth';
import { Link, Navigate } from 'react-router-dom';

export default function LoginPage() {
    const initialStateErrors = {
        email: { required: false },
        password: { required: false },
        custom_error: null
    };
    const [errors, setErrors] = useState(initialStateErrors);
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const handleInput = (event) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let errors = initialStateErrors;
        let hasError = false;

        if (inputs.email === "") {
            errors.email.required = true;
            hasError = true;
        }
        if (inputs.password === "") {
            errors.password.required = true;
            hasError = true;
        }

        if (!hasError) {
            setLoading(true);
            try {
                const response = await LoginApi(inputs);
                storeUserData(response.data.token);
                window.location.href = "/dashboard"; // Redirect to dashboard on successful login
            } catch (err) {
                if (err.response && err.response.status === 400) {
                    setErrors({ ...errors, custom_error: "Invalid Credentials." });
                } else {
                    setErrors({ ...errors, custom_error: "Something went wrong. Please try again." });
                }
            } finally {
                setLoading(false);
            }
        }
        setErrors({ ...errors });
    };

    if (isAuthenticated()) {
        // Redirect user to dashboard
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="login-page">
            <section className="login-block">
                <div className="login-container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="login-sec">
                                <h2 className="text-center">Login Now</h2>
                                <form onSubmit={handleSubmit} className="login-form">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
                                        <input type="email" className="form-control" onChange={handleInput} name="email" placeholder="email" />
                                        {errors.email.required && (
                                            <span className="text-danger">Email is required.</span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                                        <input className="form-control" type="password" onChange={handleInput} name="password" placeholder="password" />
                                        {errors.password.required && (
                                            <span className="text-danger">Password is required.</span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        {loading && (
                                            <div className="text-center">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>
                                        )}
                                        {errors.custom_error && (
                                            <p className="text-danger">{errors.custom_error}</p>
                                        )}
                                        <input type="submit" className="btn btn-login float-right" disabled={loading} value="Login" />
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className="form-group">
                                        <Link to="/register">Forgot Password?</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
