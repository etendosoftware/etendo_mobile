import { SET_LOADING } from "../contexts/actionsTypes";
import { getUrl } from "../ob-api/ob";
import { User } from "../stores";
const method = "GET";
const loadDynamic = async (dispatch: any) => {
  dispatch({ type: SET_LOADING, loading: true });
  let storedEnviromentsUrl = await getUrl();
  const callUrlApps = `${storedEnviromentsUrl}/sws/com.etendoerp.dynamic.app.userApp`;
  await fetch(callUrlApps, {
    method: method,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${User.token}`
    },
    mode: "no-cors"
  })
    .then(async (callApps) => {
      const data = await callApps.json();
      dispatch({ appsData: data.data, logged: true });
    })
    .catch((err) => {
      dispatch({ appsData: [], logged: true });
      console.log(err);
    })
    .finally(() => {
      dispatch({ type: SET_LOADING, loading: false });
    });
};

export default loadDynamic;