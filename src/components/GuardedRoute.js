import React from 'react';
import { Route, Redirect, Navigate } from "react-router-dom";

const GuardedRoute = ({ element: Component, auth, ...rest }) => (
    <Route {...rest} element={  
        auth === true
           ? <Component />
            : <Navigate to="/auth/login" />
    }/>
)

export default GuardedRoute;