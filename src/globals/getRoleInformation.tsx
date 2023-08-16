import { OBRest, Restrictions } from "etrest";
import { IRecord } from "../types/Record";
import { IData } from "../interfaces";

export const getOrganizationName = async (data: IData) => {
  let criteria = OBRest.getInstance().createCriteria("Organization");
  criteria.add(Restrictions.equals("id", data.organization));
  let org: IRecord = await criteria.uniqueResult();
  return org.name;
};

export const getClientName = async (data: IData) => {
  let criteria = OBRest.getInstance().createCriteria("ADClient");
  criteria.add(Restrictions.equals("id", data.client));
  let client: IRecord = await criteria.uniqueResult();
  return client.name;
};

export const getWarehouseName = async (data: IData) => {
  let criteria = OBRest.getInstance().createCriteria("Warehouse");
  criteria.add(Restrictions.equals("id", data.warehouseId));
  let warehouse: IRecord = await criteria.uniqueResult();
  return warehouse?.name;
};

export const getRoleName = async (data: IData) => {
  let criteria = OBRest.getInstance().createCriteria("ADRole");
  criteria.add(Restrictions.equals("id", data.roleId));
  let role: IRecord = await criteria.uniqueResult();
  return role.name;
};
