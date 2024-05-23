import "./login.css";
export default function Login() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-11 mt-60 mx-md-auto">
          <div className="login-box bg-white pl-lg-5 pl-0">
            <div className="row no-gutters align-items-center">
              <div className="col-md-6">
                <div className="form-wrap bg-white">
                  <h4 className="btm-sep pb-3 mb-5">Login</h4>
                  <form className="form" method="post" action="#">
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group position-relative">
                          <span className="zmdi zmdi-account"></span>
                          <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Email Address"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group position-relative">
                          <span className="zmdi zmdi-email"></span>
                          <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Password"
                          />
                        </div>
                      </div>
                      <div className="col-12 text-lg-right">
                        <a href="#" className="c-black">
                          Forgot password ?
                        </a>
                      </div>
                      <div className="col-12 mt-30">
                        <button
                          type="submit"
                          id="submit"
                          className="btn btn-lg btn-custom btn-dark btn-block"
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-md-6">
                <div className="content text-center">
                  <div className="border-bottom pb-5 mb-5">
                    <h3 className="c-black">First time here?</h3>
                    <a href="sign-up.html" className="btn btn-custom">
                      Sign up
                    </a>
                  </div>
                  <h5 className="c-black mb-4 mt-n1">Or Sign In With</h5>
                  <div className="socials">
                    <a href="#" className="zmdi zmdi-facebook"></a>
                    <a href="#" className="zmdi zmdi-twitter"></a>
                    <a href="#" className="zmdi zmdi-google"></a>
                    <a href="#" className="zmdi zmdi-instagram"></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
