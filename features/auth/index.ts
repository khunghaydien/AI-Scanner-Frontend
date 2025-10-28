// Auth Components
export { default as SignIn } from './components/sign-in';
export { default as SignUp } from './components/sign-up/index';
export { default as ForgotPassword } from './components/forgot-password/index';
export { default as ChangePassword } from './components/change-password/index';
export { default as UserProfile } from './components/user-profile/index';
export { default as SocialSignIn } from './components/social-sign-in/index';

// Auth Hooks
export { useSignIn } from './components/sign-in/sign-in.hook';
export { useSignUp } from './components/sign-up/sign-up.hook';
export { useChangePassword } from './components/change-password/change-password.hook';
export { useForgotPassword } from './components/forgot-password/forgot-password.hook';
export { useUserProfile } from './components/user-profile/user-profile.hook';
export { useSocialAuth } from './components/social-sign-in/social-sign-in.hook';

// Auth Gate (replace HOCs)
export { default as AuthGate } from './components/auth-gate/auth-gate';

// Auth Types
export type { SignInData } from './components/sign-in/sign-in.hook';
export type { SignUpData } from './components/sign-up/sign-up.hook';
export type { ChangePasswordData } from './components/change-password/change-password.hook';
export type { ForgotPasswordData } from './components/forgot-password/forgot-password.hook';
export type { SocialProvider } from './components/social-sign-in/social-sign-in.hook';
