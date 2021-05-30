import SignUp from "@iso/containers/Pages/SignUp/SignUp";
import SignIn from "@iso/containers/Pages/SignIn/SignIn";
import ResendEmailConfirm from "@iso/containers/Pages/ResendEmailConfirm/ResendEmailConfirm";
import ResetPassword from "@iso/containers/Pages/ResetPassword/ResetPassword";
import VerifyPage from "@iso/containers/Pages/VerifyPage/VerifyPage";

export default {
  Landing: {
    component: SignUp,
    path: '/'
  },
  SignUp: {
    component: SignUp,
    path: '/signup'
  },
  SignIn: {
    component: SignIn,
    path: '/signin'
  },
  ResendEmailConfirm: {
    component: ResendEmailConfirm,
    path: '/resendemail'
  },
  ResetPassword: {
    component: ResetPassword,
    path: '/resetpassword'
  },
  VerifyPage:{
    component: VerifyPage,
    path: '/verify'
  }
};
