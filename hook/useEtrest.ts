import { useState, useEffect } from "react";
import { OBRest, Restrictions } from "etrest";
import { IData } from "../src/interfaces";
import { IRecord } from "../src/types";
import { useUser } from "./useUser";

export const useEterest = (selectedUrl: string, token: string) => {
  const { logout } = useUser();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (selectedUrl && token) {
      OBRest.init(new URL(selectedUrl), token);
      OBRest.loginWithToken(token);
    }
  }, [selectedUrl, token]);

  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error]);

  const getOrganizationName = async (data: IData): Promise<string> => {
    try {
      let criteria = OBRest.getInstance().createCriteria("Organization");
      criteria.add(Restrictions.equals("id", data.organization));
      let org: IRecord = await criteria.uniqueResult();
      return org.name;
    } catch (error) {
      console.error("error", error);
      setError(new Error(`Failed to fetch organizationName: ${error.message}`));
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
      console.error("error", error);
      setError(new Error(`Failed to fetch getClientName: ${error.message}`));
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
      console.error("error", error);
      setError(new Error(`Failed to fetch getWarehouseName: ${error.message}`));
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
      console.error("error", error);
      setError(new Error(`Failed to fetch getRoleName: ${error.message}`));
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
