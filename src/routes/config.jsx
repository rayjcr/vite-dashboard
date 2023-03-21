import React from 'react'
import { useIntl } from 'react-intl'
import PrivateRoute from './privateRoute';

export default function WrapperRouteComponent({ auth, children }) {

  const { formatMessage } = useIntl();

  if(auth) {
    return <PrivateRoute>{children}</PrivateRoute>
  } else {
    <>{children}</>
  }
}
