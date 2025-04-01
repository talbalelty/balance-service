export interface DatabaseInterface {
    updateById(tableName: string, id: string, data: object): void;
    queryById(tableName: string, id: string): any;
}