import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Signin = ({ loadUser, onRouteChange }) => {
  return (
    <Formik
      initialValues={{ email: '', password: '', isValid: true }}
      onSubmit={(values, { setValues }) => {
        fetch('https://mysterious-stream-69304.herokuapp.com/signin', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: values.email,
            password: values.password
          })
        })
          .then(response => response.json())
          .then(user => {
            if (user.id) {
              loadUser(user);
              onRouteChange('home');
            } else {
              setValues({ email: '', password: '', isValid: false });
            }
          })
          .catch(console.log);
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Invalid email address')
          .required('Required'),
        password: Yup.string()
          .required('Required')
      })}
    >
      {(props) => {
        const { values, touched, errors, handleChange, handleBlur, handleSubmit } = props;
        return (
          <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
              <form className="measure" onSubmit={handleSubmit}>
                <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                  <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                  <div className="mt3">
                    <label className="db fw6 lh-copy f6" htmlFor="email">Email</label>
                    <input
                      className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                      type="email"
                      name="email"
                      id="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.email && touched.email ? (
                      <p className='dark-red tl'>{errors.email}</p>
                    ) : null}
                  </div>
                  <div className="mv3">
                    <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                    <input
                      className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                      type="password"
                      name="password"
                      id="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.password && touched.password ? (
                      <p className='dark-red tl'>{errors.password}</p>
                    ) : null}
                  </div>
                </fieldset>
                {!values.isValid ? (
                  <p className='dark-red tl mt0'>Incorrect email or password</p>
                ) : null}
                <input
                  className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                  type="submit"
                  value="Sign in"
                />
                <div className="lh-copy mt3">
                  <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
                </div>
              </form>
            </main>
          </article>
        );
      }}
    </Formik>
  );
}

export default Signin;