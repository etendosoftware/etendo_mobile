import { useEffect } from "react";
import { OBRest, Restrictions } from "etrest";
import { IData } from "../src/interfaces";
import { IRecord } from "../src/types";

// The server rejects reads of entities the role cannot access (e.g. a role
// without Window Access) with 401/403.
export const isAccessDeniedError = (error: any): boolean => {
  const status = error?.response?.status;
  return status === 401 || status === 403;
};

export const useEtrest = (selectedUrl: string, token: string) => {
  useEffect(() => {
    if (selectedUrl && token) {
      OBRest.init(new URL(selectedUrl), token);
      OBRest.loginWithToken(token);
    }
  }, [selectedUrl, token]);

  // Failures here (e.g. a role without read access to an entity) must not end
  // the session: errors are propagated so each screen can fall back gracefully.
  const getOrganizationName = async (data: IData): Promise<string> => {
    try {
      let criteria = OBRest.getInstance().createCriteria("Organization");
      criteria.add(Restrictions.equals("id", data.organization));
      let org: IRecord = await criteria.uniqueResult();
      return org.name;
    } catch (error) {
      console.error("Failed to fetch organizationName", error);
      throw error;
    }
  };

  const getClientName = async (data: IData): Promise<string> => {
    try {
      let criteria = OBRest.getInstance().createCriteria("ADClient");
      criteria.add(Restrictions.equals("id", data.client));
      let client: IRecord = await criteria.uniqueResult();
      return client.name;
    } catch (error) {
      console.error("Failed to fetch clientName", error);
      throw error;
    }
  };

  const getWarehouseName = async (data: IData) => {
    try {
      let criteria = OBRest.getInstance().createCriteria("Warehouse");
      criteria.add(Restrictions.equals("id", data.warehouseId));
      let warehouse: IRecord = await criteria.uniqueResult();
      return warehouse?.name;
    } catch (error) {
      console.error("Failed to fetch warehouseName", error);
      throw error;
    }
  };

  const getRoleName = async (data: IData) => {
    try {
      let criteria = OBRest.getInstance().createCriteria("ADRole");
      criteria.add(Restrictions.equals("id", data.roleId));
      let role: IRecord = await criteria.uniqueResult();
      return role.name;
    } catch (error) {
      console.error("Failed to fetch roleName", error);
      throw error;
    }
  };

  return {
    getOrganizationName,
    getClientName,
    getWarehouseName,
    getRoleName
  };
};
