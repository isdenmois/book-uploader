import React from 'react';
import { useRecoilValue } from 'recoil';
import { Login } from './login';
import { ProfileData } from './profile-data';
import { profileState } from './profile.state';

export function ProfileScreen() {
  const profile = useRecoilValue(profileState);

  if (profile) return <ProfileData />;

  return <Login />;
}
