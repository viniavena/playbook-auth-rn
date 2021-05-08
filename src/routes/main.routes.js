import React from 'react';

import SocialRoutes from './social.routes';
import PrivateRoutes from './private.routes';

import { useAuth } from '../context/auth';

export default function MainRoutes() {
  const { loading, token } = useAuth();

  if (loading) {
    return null;
  }

  return token ? <PrivateRoutes /> : <SocialRoutes />;
}
