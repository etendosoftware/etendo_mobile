import { IRecord } from "../../types/Record";
import { OBRest } from "etrest";

export interface onSavePromise {
  hasNewRecord: boolean;
  records: IRecord[];
}

export interface RecordServiceOnSave {
  onSave(record: IRecord, records: IRecord[]): Promise<onSavePromise>;
}

export class RecordService {
  static async onSave(record: IRecord, records?: IRecord[]): Promise<IRecord> {
    try {
      const newRecord = await OBRest.getInstance().save(record);
      // TODO Why record returns error?
      // @ts-ignore
      if (newRecord.error) {
        // @ts-ignore
        reject(newRecord.error);
        return null;
      }
      return newRecord;
    } catch (error) {
      throw error;
    }
  }
}
