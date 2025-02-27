import React from 'react';
import { useAuth } from './AuthProvider';

function About() {
  const { accessToken } = useAuth();
  return <h1>About Page</h1>;
}

export default About;
