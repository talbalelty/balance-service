import { RecordNotFoundException } from '@app/error/custom-errors';
import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * The DB in this service is made up of JSON files that are stored in the filesystem.
 * In the case of Balance each record is a different JSON file for each user.
 */
@Injectable()
export class DatabaseService {
  private readonly STORAGE_PATH = 'storage';
  
  updateById(tableName: string, id: string, data: object) {
    const filePath = this.getFilePath(tableName, id);
    const currentRecord = this.queryById(tableName, id);
    const updatedRecord = { ...currentRecord, ...data };
    writeFileSync(filePath, updatedRecord);
  }

  queryById(tableName: string, id: string): any {
    const filePath = this.getFilePath(tableName, id);
    if (!existsSync(filePath)) {
      throw new RecordNotFoundException(`Record with id ${id} not found in table ${tableName}`);
    }

    return readFileSync(filePath).toJSON();
  }

  private getFilePath(tableName: string, id: string): string {
    return join(this.STORAGE_PATH, tableName, `${id}.json`);
  }
}
