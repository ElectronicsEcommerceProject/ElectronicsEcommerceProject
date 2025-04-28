import { ThreeDots, Hearts, Rings, Circles } from "react-loader-spinner";
import { usePromiseTracker } from "react-promise-tracker";

import "./loadingIndicator.css";

const Loading = () => {
  return (
    <div className="loader">
      <Rings color="#00BFFF" height={100} width={100} />
    </div>
  );
};

const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker();

  if (promiseInProgress) {
    return <Loading />;
  }
  return <></>;
};

export default LoadingIndicator;
