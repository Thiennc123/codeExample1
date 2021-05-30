import React, { Fragment, Suspense } from "react"
import { useSelector, useDispatch } from 'react-redux';
import PrivateLayout from './PrivateLayout/PrivateLayout';
import PublicLayout  from './PublicLayout/PublicLayout';
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import privateRoutes from '../routes/private';
import publicRoutes  from '../routes/public';
import _ from 'lodash';
import ErrorBoundary from './ErrorBoundary';
import Loader from '@iso/components/utility/loader';
import Page404 from "@iso/containers/Pages/404/404";
import VerifyPage from "@iso/containers/Pages/VerifyPage/VerifyPage";
import appActions from '@iso/redux/app/actions';

const { changeCurrent } = appActions;

const Main = () => {
  const isLoggedIn = useSelector((state) => state.Auth.idToken);
  const dispatch = useDispatch();
  const pathArray = window.location.pathname.split('/');
  const urlVerify = pathArray[1];

  const handlePrivateLayout = () => {
    if(isLoggedIn){
      if(urlVerify === 'verify'){
        return (<Route path="/verify" component={VerifyPage} />);
      } else {
        return (
          <PrivateLayout>
            <Switch>
              {_.map(privateRoutes, (route, key) => {
                const { component, path } = route;
                return (
                  <Route exact path={path} key={key} component={component}/>
                )
              })}
              <Route exact path="/" key="dashboard" render={() => { dispatch(changeCurrent(['dashboard'])); return ( <Redirect to="/dashboard"/> ); }} />
              <Route component={Page404} />
            </Switch>
          </PrivateLayout>
        )
      }
    }
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
          { handlePrivateLayout() }
          { !isLoggedIn  &&
            <Fragment>
              <Switch>
                {_.map(privateRoutes, (route, key) => {
                  const { path } = route;
                  return (
                    <Route exact path={path} key={key} render={() => ( <Redirect to="/signin"/> )} />
                  )
                })}
                {_.map(publicRoutes, (route, key) => {
                  const { component, path } = route;
                  return (
                    <Route
                      exact
                      path={path}
                      key={key}
                      render={route =>
                        { 
                          return (
                            <PublicLayout component={component} />
                          );
                        }
                      }
                    />
                  )
                })}
              <Route component={Page404} />
              </Switch>
            </Fragment>
          }
      </Suspense>
    </ErrorBoundary>
  );
}

export default withRouter(Main)