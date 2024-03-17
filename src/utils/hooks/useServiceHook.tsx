import { History, Location } from 'history';
import { useHistory, useLocation } from 'react-router';

const useServiceHook = (): {
  history: History<unknown>;
  location: Location<unknown>;
} => {
  const location = useLocation();
  const history = useHistory();

  return {
    location,
    history,
  };
};

export default useServiceHook;
