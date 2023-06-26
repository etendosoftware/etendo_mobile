import { OBRest, Restrictions } from "obrest";
import { IRecord } from "../types/Record";
import { User } from "../stores";

export const getOrganizationName = async () => {
  let criteria = OBRest.getInstance().createCriteria("Organization");
  criteria.add(Restrictions.equals("id", User.data.organization));
  let org: IRecord = await criteria.uniqueResult();
  return org.name;
};

export const getClientName = async () => {
  let criteria = OBRest.getInstance().createCriteria("ADClient");
  criteria.add(Restrictions.equals("id", User.data.client));
  let client: IRecord = await criteria.uniqueResult();
  return client.name;
};

export const getWarehouseName = async () => {
  let criteria = OBRest.getInstance().createCriteria("Warehouse");
  criteria.add(Restrictions.equals("id", User.data.warehouseId));
  let warehouse: IRecord = await criteria.uniqueResult();
  return warehouse?.name;
};

export const getRoleName = async () => {
  let criteria = OBRest.getInstance().createCriteria("ADRole");
  criteria.add(Restrictions.equals("id", User.data.roleId));
  let role: IRecord = await criteria.uniqueResult();
  return role.name;
};
