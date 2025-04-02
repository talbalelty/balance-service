import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { RecordNotFoundException } from '@app/error/custom-errors';
import { DatabaseInterface } from './database.interface';
import { readFile, writeFile, unlink } from 'fs/promises';

/**
 * 1. The DB in this service is made up of JSON files that are stored in the filesystem.
 * 2. In the case of Balance each record is a different JSON file for each user.
 * 3. For ease of use, the file name is the user id.
 */
@Injectable()
export class DatabaseService implements DatabaseInterface {
  private readonly STORAGE_PATH = join(__dirname, 'storage');

  constructor() {
    this.createStorageDirectory();
  }

  /**
   * because the file name is the user id, we also consider this function as overwrite.
   * @param tableName 
   * @param id 
   * @param data 
   */
  async create(tableName: string, id: string, data: object) {
    data['userId'] = id;
    const filePath = this.getFilePath(tableName, id);
    await writeFile(filePath, JSON.stringify(data));
    return data;
  }

  async queryById(tableName: string, id: string) {
    const filePath = this.getFilePath(tableName, id);
    if (!existsSync(filePath)) {
      throw new RecordNotFoundException(`Record with id ${id} not found in table ${tableName}`);
    }

    return JSON.parse(await readFile(filePath, 'utf-8'));
  }

  async updateById(tableName: string, id: string, data: object) {
    const filePath = this.getFilePath(tableName, id);
    const currentRecord = await this.queryById(tableName, id);
    const updatedRecord = { ...currentRecord, ...data };
    await writeFile(filePath, JSON.stringify(updatedRecord));
    return updatedRecord;
  }

  async deleteById(tableName: string, id: string) {
    const filePath = this.getFilePath(tableName, id);
    return await unlink(filePath);
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