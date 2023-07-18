import { OBRest, Restrictions } from "etrest";
import { User } from "../stores";
import { SET_BINDARY_IMG } from "../contexts/actionsTypes";

const getImageProfile = async (dispatch: any) => {
  try {
    const imageIdCriteria = OBRest.getInstance().createCriteria("ADUser");
    imageIdCriteria.add(Restrictions.equals("id", User.data.userId));
    const user: any = await imageIdCriteria.uniqueResult();
    const imageCriteria = OBRest.getInstance().createCriteria("ADImage");
    imageCriteria.add(Restrictions.equals("id", user.image));
    const imageList: any[] = await imageCriteria.list();
    if (imageList.length) {
      if (imageList[0]?.bindaryData) {
        dispatch({
          type: SET_BINDARY_IMG,
          bindaryImg: imageList[0].bindaryData
        });
      }
    }
  } catch (error) {}
};
export default getImageProfile;
