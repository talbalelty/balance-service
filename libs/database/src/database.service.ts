import { RecordNotFoundException } from '@app/error/custom-errors';
import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * The DB in this service is made up of JSON files that are stored in the filesystem.
 * In the case of Balance each record is a different JSON file for each user.
 */
@Injectable()
export class DatabaseService {
  private readonly STORAGE_PATH = join(__dirname, 'storage');

  constructor() {
    this.createStorageDirectory();
  }

  updateById(tableName: string, id: string, data: object) {
    const filePath = this.getFilePath(tableName, id);
    const currentRecord = this.queryById(tableName, id);
    const updatedRecord = { ...currentRecord, ...data };
    writeFileSync(filePath, JSON.stringify(updatedRecord));
  }

  queryById(tableName: string, id: string): any {
    const filePath = this.getFilePath(tableName, id);
    if (!existsSync(filePath)) {
      throw new RecordNotFoundException(`Record with id ${id} not found in table ${tableName}`);
    }

    return JSON.parse(readFileSync(filePath, 'utf-8'));
  }

  private getFilePath(tableName: string, id: string): string {
    return join(this.STORAGE_PATH, tableName, `${id}.json`);
  }

  private createStorageDirectory() {
    if (!existsSync(this.STORAGE_PATH)) {
      mkdirSync(join(this.STORAGE_PATH, 'balance'), { recursive: true });
    }

    // Write the file
    writeFileSync(join(this.STORAGE_PATH, 'balance', '0000.json'), JSON.stringify({
      "userId": "0000",
      "assets": {
        "bitcoin": 50,
        "ethereum": 100,
        "oobit": 1000
      }
    }));
  }
}