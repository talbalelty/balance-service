import { RecordNotFoundException } from '@app/error/custom-errors';
import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * The DB in this service is made up of JSON files that are stored in the filesystem.
 * In the case of Balance each record is a different JSON file for each user.
 */
@Injectable()
export class DatabaseService {
  private readonly STORAGE_PATH = 'storage/';
  updateById(tableName: string, id: string, data: object) {
    throw new Error('Method not implemented.');
  }
  queryById(tableName: string, id: string): any {
    const filePath = join(this.STORAGE_PATH, tableName, `${id}.json`);
    if (!existsSync(filePath)) {
      throw new RecordNotFoundException(`Record with id ${id} not found in table ${tableName}`);
    }
    
    return readFileSync(filePath).toJSON();
  }
}
